import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
// Import Role to ensure it's registered before TeamMember
import "./Role";

export interface TeamLink {
  label: string; // e.g. "GitHub", "LinkedIn", "Website"
  url: string; // must be https://
  icon?: string; // "github" | "linkedin" | "globe" | "notion" | "x" etc.
  pinned?: boolean; // highlight in UI
  order?: number; // for sorting
}

export interface ITeamMember extends mongoose.Document {
  fullName: string;
  nickname?: string;
  role: mongoose.Types.ObjectId;
  category: "Core" | "Member";
  skills?: string[];
  bio?: string;
  slogan?: string; // NEW: short tagline (2-120 chars)
  photoUrl?: string;
  links?: TeamLink[]; // NEW: external links
  pin: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePin(candidatePin: string): Promise<boolean>;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    nickname: {
      type: String,
      trim: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    category: {
      type: String,
      enum: ["Core", "Member"],
      default: "Member",
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      trim: true,
    },
    slogan: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    photoUrl: {
      type: String,
    },
    links: {
      type: [
        {
          label: {
            type: String,
            required: true,
            trim: true,
            maxlength: 40,
          },
          url: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300,
          },
          icon: {
            type: String,
            trim: true,
          },
          pinned: {
            type: Boolean,
            default: false,
          },
          order: {
            type: Number,
            default: 0,
          },
        },
      ],
      default: [],
      validate: {
        validator: function (links: TeamLink[]) {
          return links.length <= 10;
        },
        message: "Maximum 10 links allowed per member",
      },
    },
    pin: {
      type: String,
      required: true,
      // Note: PIN is hashed with bcrypt, resulting in ~60 character string
      // Validation for length (6 digits) is done before hashing in the API
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash PIN before saving
teamMemberSchema.pre("save", async function (next) {
  if (!this.isModified("pin")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin, salt);
    next();
  } catch (error: unknown) {
    next(error as Error);
  }
});

// Method to compare PIN
teamMemberSchema.methods.comparePin = async function (
  candidatePin: string
): Promise<boolean> {
  return bcrypt.compare(candidatePin, this.pin);
};

teamMemberSchema.index({ fullName: 1 });
teamMemberSchema.index({ category: 1, isActive: 1 });

// Clear cached model if exists in development
if (process.env.NODE_ENV !== "production" && mongoose.models.TeamMember) {
  delete mongoose.models.TeamMember;
}

const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember ||
  mongoose.model<ITeamMember>("TeamMember", teamMemberSchema);

export default TeamMember;
