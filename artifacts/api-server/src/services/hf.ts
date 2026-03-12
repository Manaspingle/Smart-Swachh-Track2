import { HfInference } from "@huggingface/inference";

export type WasteCategory =
  | "organic"
  | "plastic"
  | "metal"
  | "glass"
  | "ewaste"
  | "paper"
  | "other";

type HfLabelScore = { label: string; score: number };

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`${name} must be set`);
  }
  return value;
}

function parseDataUrlToBuffer(imageBase64: string): Buffer {
  const trimmed = imageBase64.trim();
  const commaIdx = trimmed.indexOf(",");
  const base64 = commaIdx >= 0 ? trimmed.slice(commaIdx + 1) : trimmed;
  return Buffer.from(base64, "base64");
}

function normalizeLabel(label: string): string {
  return label.trim().toLowerCase().replaceAll("_", " ").replaceAll("-", " ");
}

function mapWasteLabelToCategory(label: string): WasteCategory {
  const l = normalizeLabel(label);

  // Common labels from waste/trash datasets
  if (l.includes("plastic")) return "plastic";
  if (l.includes("metal") || l.includes("aluminium") || l.includes("aluminum")) return "metal";
  if (l.includes("glass")) return "glass";
  if (l.includes("paper") || l.includes("cardboard")) return "paper";
  if (l.includes("biological") || l.includes("organic") || l.includes("compost")) return "organic";
  if (l.includes("battery") || l.includes("e waste") || l.includes("ewaste") || l.includes("electronic")) return "ewaste";

  // Trash/landfill/other
  return "other";
}

function categoryMeta(category: WasteCategory): {
  binColor: string;
  disposalInstructions: string;
  tips: string[];
} {
  switch (category) {
    case "plastic":
      return {
        binColor: "Blue",
        disposalInstructions:
          "Rinse and crush before placing in the Blue Recycling Bin. Remove caps and labels if possible.",
        tips: [
          "Rinse containers before recycling",
          "Crush bottles to save space",
          "Remove food residue",
          "Check the recycling number on the bottom",
        ],
      };
    case "organic":
      return {
        binColor: "Green",
        disposalInstructions:
          "Place in the Green Organic Waste Bin. Can be composted to create natural fertilizer.",
        tips: [
          "Start home composting",
          "Avoid mixing with plastic",
          "Use as garden fertilizer",
          "Keep separate from dry waste",
        ],
      };
    case "metal":
      return {
        binColor: "Grey",
        disposalInstructions:
          "Clean and place in the Grey Metal Recycling Bin. Metal is 100% recyclable indefinitely.",
        tips: [
          "Crush cans to save space",
          "Separate different metals",
          "Clean before disposing",
          "Check for sharp edges",
        ],
      };
    case "glass":
      return {
        binColor: "White",
        disposalInstructions:
          "Wrap broken glass in newspaper before placing in White Glass Recycling Bin. Handle with care.",
        tips: [
          "Wrap sharp edges safely",
          "Remove caps and lids",
          "Rinse containers",
          "Keep color-sorted if possible",
        ],
      };
    case "ewaste":
      return {
        binColor: "Red",
        disposalInstructions:
          "Take to a designated E‑Waste collection center. Do NOT put in regular bins. Contains hazardous materials.",
        tips: [
          "Never put in regular trash",
          "Find authorized e‑waste collectors",
          "Wipe data before disposing electronics",
          "Check manufacturer take‑back programs",
        ],
      };
    case "paper":
      return {
        binColor: "Yellow",
        disposalInstructions:
          "Keep dry and place in Yellow Paper Recycling Bin. Wet paper cannot be recycled.",
        tips: [
          "Keep paper dry",
          "Remove staples and clips",
          "Flatten cardboard boxes",
          "Avoid shredded paper in bins",
        ],
      };
    case "other":
      return {
        binColor: "Black",
        disposalInstructions:
          "If unsure, place in the general waste bin. Avoid contaminating recycling streams.",
        tips: [
          "When in doubt, don’t mix with recyclables",
          "Check local guidelines for special disposal",
          "Separate multi‑material items when possible",
        ],
      };
  }
}

export type WasteClassification = {
  category: WasteCategory;
  itemName: string;
  confidence: number;
  disposalInstructions: string;
  binColor: string;
  tips: string[];
  model: string;
  rawTopLabel: string;
};

export type FakeImageCheck = {
  isFakeLikely: boolean;
  score: number;
  model: string;
  raw: HfLabelScore[];
};

function getHf(): HfInference {
  const token = process.env["HF_API_TOKEN"];
  if (!token || token.trim() === "") {
    throw new Error("HF_API_TOKEN must be set to use Hugging Face inference.");
  }
  return new HfInference(token);
}

export async function classifyWasteWithHf(imageBase64: string): Promise<WasteClassification> {
  const model = process.env["HF_WASTE_MODEL"] ?? "prithivMLmods/Augmented-Waste-Classifier-SigLIP2";
  const image = parseDataUrlToBuffer(imageBase64);
  const hf = getHf();

  const results = (await hf.imageClassification({
    model,
    data: image,
  })) as HfLabelScore[];

  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("HF waste classification returned no results.");
  }

  const top = results.reduce((best, cur) => (cur.score > best.score ? cur : best), results[0]);
  const category = mapWasteLabelToCategory(top.label);
  const meta = categoryMeta(category);

  return {
    category,
    itemName: top.label,
    confidence: Math.round(top.score * 100) / 100,
    disposalInstructions: meta.disposalInstructions,
    binColor: meta.binColor,
    tips: meta.tips,
    model,
    rawTopLabel: top.label,
  };
}

export async function checkFakeImageWithHf(imageBase64: string): Promise<FakeImageCheck> {
  const model = process.env["HF_FAKE_IMAGE_MODEL"] ?? "capcheck/ai-image-detection";
  const threshold = Number(process.env["HF_FAKE_IMAGE_THRESHOLD"] ?? "0.8");
  const image = parseDataUrlToBuffer(imageBase64);
  const hf = getHf();

  const results = (await hf.imageClassification({
    model,
    data: image,
  })) as HfLabelScore[];

  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("HF fake-image detection returned no results.");
  }

  // Try to find the "fake/ai" label
  const normalized = results.map((r) => ({ ...r, label: normalizeLabel(r.label) }));
  const fakeCandidate =
    normalized.find((r) => r.label.includes("ai")) ??
    normalized.find((r) => r.label.includes("fake")) ??
    normalized.find((r) => r.label.includes("generated"));

  const score = fakeCandidate?.score ?? 0;

  return {
    isFakeLikely: score >= threshold,
    score: Math.round(score * 100) / 100,
    model,
    raw: results,
  };
}

