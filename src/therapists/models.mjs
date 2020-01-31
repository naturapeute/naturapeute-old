import mongoose from 'mongoose'
import { Symptom } from '../symptoms/models.mjs'


mongoose.connect('mongodb://localhost:27017/terrapeutes', {useNewUrlParser: true, useUnifiedTopology: true })


const Therapy = mongoose.model('Therapy', {
  slug: String,
  name: String,
  airtableId: String,
})

const GeoLocation = new mongoose.Schema({
  coordinates: [Number],
  type: { type: String, default: 'Point' },
  index: { type: String, default: '2dsphere' },
})

const Office = new mongoose.Schema({
  street: String,
  zipCode: String,
  city: String,
  country: { type: String, default: 'ch' },
  pictures: [String],
  location: GeoLocation,
})

const TherapistSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  isCertified: Boolean,
  description: String,
  cost: String,
  timetable: String,
  languages: [String],
  photo: String,
  socials: [Object],
  therapies: [{ type: mongoose.ObjectId, ref: Therapy }],
  agreements: [String],
  paymentTypes: [String],
  symptoms: [{ type: mongoose.ObjectId, ref: Symptom }],
  offices: [Office],
  creationDate: { type: Date, default: Date.now },
  expirationDate: Date,
  disabled: Boolean,
  airtableId: String,
})

TherapistSchema.virtual('photoUrl').get(function() {
  return this.photo
})

TherapistSchema.virtual('name').get(function() {
  return `${this.firstname} ${this.lastname}`
})

TherapistSchema.virtual('city').get(function() {
  return this.offices.length && this.offices[0].city
})

TherapistSchema.virtual('url').get(function() {
  return `/${this.slug}/${this.airtableId}`
})

const Therapist = mongoose.model('Therapist', TherapistSchema)


export { Therapist, Therapy }
