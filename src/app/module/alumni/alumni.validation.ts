import { z } from "zod";

// Enums
const AlumniCategoryEnum = z.enum(["corporate", "research", "academia", "administration", "business", "other"]);
const GenderEnum = z.enum(["male", "female", "other"]);
const DegreeEnum = z.enum(["MS", "PhD", "Postdoc", "Research Associate", "Other"]);


// Sub-schemas
const LocationSchema = z.object({
  country: z.string(),
  city: z.string(),
});

const SocialMediaSchema = z.object({
  platform: z.string(),
  link: z.string().url(),
});

const AlumniAchievementsSchema = z.object({
  title: z.string(),
  description: z.string(),
  year: z.number().int(),
});

const CorporateInfoSchema = z.object({
  company: z.string(),
  designation: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean(),
});

const ResearchInfoSchema = z.object({
  institution: z.string(),
  researchArea: z.array(z.string()),
  degree: DegreeEnum,//! degree is not a professional word to explain. later it has to be changed
  supervisor: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean(),
  description: z.string(),
});

const AcademiaInfoSchema = z.object({
  university: z.string(),
  position: z.string(),
  department: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean(),
  description: z.string(),
});

const AdministrationInfoSchema = z.object({
  organization: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean(),
  description: z.string(),
});

const BusinessInfoSchema = z.object({
  businessName: z.string(),
  startDate: z.string(),
  endDate:  z.string().optional(),
  currentlyWorking: z.boolean(),
  description: z.string(),
  location: z.string(),
  website: z.string().url(),
});

const OtherInfoSchema = z.object({
  title: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean(),
  location: z.string(),
});

// Alumni Profile Schema
const AlumniProfileSchema = z.object({
  alumniCategory: AlumniCategoryEnum,
  corporateInfo: z.array(CorporateInfoSchema).optional(),
  researchInfo: z.array(ResearchInfoSchema).optional(),
  academiaInfo: z.array(AcademiaInfoSchema).optional(),
  administrationInfo: z.array(AdministrationInfoSchema).optional(),
  businessInfo: z.array(BusinessInfoSchema).optional(),
  otherInfo: z.array(OtherInfoSchema).optional(),

});

// Main Alumni Schema
const alumniSchema = z.object({
   studentId: z
    .string()
    .regex(/^\d+$/, { message: 'Student ID must be numeric string only' }),
  name: z.string(),
  gender: GenderEnum,
  email: z.string().email(),
  graduationYear: z.number().int(),
  contactNumber: z.string(),
  socialMedia: z.array(SocialMediaSchema).optional(),
  willingTomentor: z.boolean(),
  location: LocationSchema,
  session: z.string(),
  achievements: z.array(AlumniAchievementsSchema).optional(),
  portfolioLink: z.string().url().optional(),
  alumniProfile: AlumniProfileSchema,
  department: z.string(),
  faculty: z.string(),

});

const alumniSignupValidationSchema = z.object({
  body: z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    alumni: alumniSchema,
  }),
});



// For updates (all fields optional)
// const UpdateAlumniSchema = AlumniSchema.partial();

// Export all schemas
export const alumniValidation = {
  alumniSignupValidationSchema,
  // UpdateAlumniSchema,
};
