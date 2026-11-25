# AquaScan Pro: local vision model evaluation (site photos)

Branch `ws/aquascan-site-photos`, 2026-11-25. Code: `external/borehole-ai-engine/src/siteVision.ts`.

**Management decisions applied:**
- No paid vision service.
- Only open models that run locally (in the browser or on our own infrastructure), with no recurring charge.
- Every licence layer must permit commercial use.
- Detections stay **hints** until a class passes an independent evaluation.
- The customer's checklist always governs.

**Status:**
- **No model is enabled.** The shipped provider is `DISABLED_PROVIDER`, and the screen says "Automated visual review not enabled".
- **The evaluation set has not been built** (section 4), so **no accuracy figure is declared for any detector.**

## 1. Licence per layer

A model is eligible only if **every** layer permits commercial use. A permissive library does not make its models permissive.

**CLIP** (OpenAI ViT-B/32), via transformers.js:

| Layer | Licence and evidence | Commercial use? |
|---|---|---|
| Library | transformers.js, Apache-2.0 (repository LICENSE; not re-fetched in this pass) | Yes |
| Architecture/code | openai/CLIP, MIT (repository LICENSE) | Yes |
| Weights | The model card (https://github.com/openai/CLIP/blob/main/model-card.md, fetched 2026-11-25) says: **"Any deployed use case of the model - whether commercial or not - is currently out of scope."** | **No** |
| Training data | WebImageText (not public) | Unknown |

**Eligible: NO.** The weights are restricted by the model card.

**OWL-ViT** (google/owlvit-base-patch32), via transformers.js (ONNX port Xenova/owlvit-base-patch32):

| Layer | Licence and evidence | Commercial use? |
|---|---|---|
| Library | transformers.js, Apache-2.0 | Yes |
| Architecture/code | google-research scenic, Apache-2.0 (not re-fetched) | Yes |
| Weights | The model card (https://huggingface.co/google/owlvit-base-patch32, fetched 2026-11-25) gives "License: apache-2.0". It also says it is "intended as a research output for research communities" and "The primary intended users of these models are AI researchers." | Licence: yes. Intended use: research. |
| Training data | Model card: CLIP backbone "trained from scratch" on "publicly available image-caption data … YFCC100M"; heads fine-tuned on "COCO and OpenImages". These datasets carry mixed per-image licences. | Not established |
| Port | Xenova ONNX port: licence to be confirmed on its model card | Not checked |

**Eligible: PENDING.** A legal review is needed of the "research output" wording and of the training-data terms. Size: about 0.2 B parameters (about 150 MB quantised ONNX, estimated, not measured).

**OWLv2:** same family as OWL-ViT; the model card was not checked in this pass. **Eligible: NOT CHECKED.**

**COCO-SSD**, TF.js (`@tensorflow-models/coco-ssd`):

| Layer | Licence and evidence | Commercial use? |
|---|---|---|
| Library | tfjs-models, Apache-2.0 (repository LICENSE; not re-fetched) | Yes |
| Architecture/code | TF Object Detection API, Apache-2.0 | Yes |
| Weights | TF model zoo, Apache-2.0 (not re-fetched) | Yes |
| Training data | COCO: annotations CC BY 4.0; images are Flickr images under various licences | Not established for the weights |
| Dependency | The package is **not installed**; adding it is a new npm dependency, which needs approval | — |

**Eligible: PENDING** (a dataset-terms review, and approval of the dependency).

**MobileNet v2**, TF.js (already in the repo):

| Layer | Licence and evidence | Commercial use? |
|---|---|---|
| Library | `@tensorflow-models/mobilenet`, Apache-2.0 | Yes |
| Weights | Self-hosted in `public/models/mobilenet` | Unknown |
| Training data | ImageNet terms of access (image-net.org; not re-fetched in this pass) restrict the database to non-commercial research and educational use | **Doubtful** for the weights |

**Eligible: NO** for this workflow. Its labels are not shown in the site-photo workflow.

**Excluded outright:**
- **Ultralytics YOLOv5, v8 and 11:** AGPL-3.0.
- **Paid APIs:** OpenAI Vision and similar. `app/api/ml/analyze-image` is used for solar only.

## 2. What each could even name (site objects)

| Object | CLIP (zero-shot) | OWL-ViT (open vocabulary) | COCO-SSD (80 COCO classes) | MobileNet (ImageNet) |
|---|---|---|---|---|
| Power lines and poles | prompt only | prompt "utility pole" | no class | "pole" (generic) |
| Buildings | prompt | prompt | no class | some (e.g. "boathouse") |
| Vehicles and trucks | prompt | prompt | car, truck | trailer truck |
| Water surfaces | prompt | weak | no | lakeside (scene) |
| Trees | prompt | prompt | no | no |
| Latrine-like structures | unreliable | unreliable | no | no |
| Fuel tanks | unreliable | unreliable | no | no |
| Slope | not an object | no | no | no |

Even an eligible model can name only generic objects. Latrines, septic tanks, soak pits, cattle dips, fuel storage, graveyards and slope stay with the customer's checklist. AquaScan never turns a generic "structure" into a specific hazard; this is enforced in `featureStatements` and tested.

## 3. Download size and in-browser speed (estimates, not measured)

| Model | Download to the visitor | Inference on a mid-range phone, per photo |
|---|---|---|
| COCO-SSD lite | about 5 MB | about 0.3–1 s |
| MobileNet v2 | about 14 MB (already served) | about 0.2–0.5 s |
| OWL-ViT B/32, quantised | about 150 MB | several seconds or more |
| CLIP B/32 | about 90 MB | about 1–3 s |

These are estimates from public model sizes, not measurements. Measure on the target devices before any decision.

## 4. Independent evaluation (pending)

**Framework**, in `siteVision.ts`:
- `EvalImage` records each image's source, licence, attribution and ground-truth labels.
- `evaluateClass` counts hits, misses and false alarms, and gives precision and recall.
- `PROMOTION_THRESHOLD`: precision ≥ 0.90 **and** recall ≥ 0.80, with at least 30 positive examples per class.
- Until a class passes on the documented set, `PROMOTED_CLASSES` stays empty.

**What remains:**
1. Assemble about 200 openly licensed outdoor photos (Wikimedia Commons CC0 or CC BY, with attribution recorded per image). Include rural East African plots with and without poles and lines, buildings, vehicles and standing water.
2. Label the photos independently.
3. Run the eligible model locally and record the counts per class.
4. Promote only the classes that pass; update `PROMOTED_CLASSES` with a citation to the evaluation record.

Until then:
- every feature is **NOT ASSESSED**;
- a future unvalidated detection is **POSSIBLE** ("please confirm in the checklist");
- **VALIDATED DETECTION** is reserved for promoted classes.

**Failure handling.** If a model fails to load or times out, the output says "Automated photo review unavailable — checklist only" (`runVisionSafely`, tested). Blurred and dark photos are not sent to a model.
