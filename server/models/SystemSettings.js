import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema({
    heroMovie: { type: String, ref: 'Movie' },
}, { timestamps: true });

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);

export default SystemSettings;
