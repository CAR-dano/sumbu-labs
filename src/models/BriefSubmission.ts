import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAttachment {
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface IBriefSubmission extends Document {
  // Contact
  fullName: string;
  company?: string;
  email: string;
  phone?: string;

  // Project
  projectTitle?: string;
  projectType: string[];
  goals?: string;
  problems?: string;
  scopeFeatures?: string[];
  platforms?: string[];
  integrations?: string[];
  references?: string[];
  attachments?: IAttachment[];

  // Business
  budgetRange?:
    | "under-5k"
    | "5-10k"
    | "10-25k"
    | "25-50k"
    | "50-100k"
    | "100k-plus";
  timeline?: "asap" | "1-2 months" | "3-6 months" | "flexible";
  startDateTarget?: Date;
  locationTimezone?: string;

  // Privacy & Consent
  ndaRequired?: boolean;
  acceptPolicy: boolean;

  // System
  status: "new" | "reviewing" | "replied" | "qualified" | "archived";
  starred?: boolean;
  internalNotes?: string;
  ua?: string;
  ipHash?: string;

  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema = new Schema<IAttachment>(
  {
    url: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
  },
  { _id: false }
);

const BriefSubmissionSchema = new Schema<IBriefSubmission>(
  {
    // Contact
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    company: { type: String, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    phone: { type: String, trim: true, maxlength: 30 },

    // Project
    projectTitle: { type: String, trim: true, maxlength: 200 },
    projectType: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: "At least one project type is required",
      },
    },
    goals: { type: String, trim: true, maxlength: 2000 },
    problems: { type: String, trim: true, maxlength: 2000 },
    scopeFeatures: { type: [String], default: [] },
    platforms: { type: [String], default: [] },
    integrations: { type: [String], default: [] },
    references: { type: [String], default: [] },
    attachments: { type: [AttachmentSchema], default: [] },

    // Business
    budgetRange: {
      type: String,
      enum: ["under-5k", "5-10k", "10-25k", "25-50k", "50-100k", "100k-plus"],
    },
    timeline: {
      type: String,
      enum: ["asap", "1-2 months", "3-6 months", "flexible"],
    },
    startDateTarget: { type: Date },
    locationTimezone: { type: String, trim: true, maxlength: 100 },

    // Privacy & Consent
    ndaRequired: { type: Boolean, default: false },
    acceptPolicy: { type: Boolean, required: true },

    // System
    status: {
      type: String,
      enum: ["new", "reviewing", "replied", "qualified", "archived"],
      default: "new",
    },
    starred: { type: Boolean, default: false },
    internalNotes: { type: String, trim: true, maxlength: 5000 },
    ua: { type: String },
    ipHash: { type: String },
  },
  {
    timestamps: true,
  }
);

// Indexes
BriefSubmissionSchema.index({ status: 1, createdAt: -1 });
BriefSubmissionSchema.index({ email: 1 });
BriefSubmissionSchema.index({ starred: 1 });

const BriefSubmission: Model<IBriefSubmission> =
  mongoose.models.BriefSubmission ||
  mongoose.model<IBriefSubmission>("BriefSubmission", BriefSubmissionSchema);

export default BriefSubmission;
