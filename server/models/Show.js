import mongoose from "mongoose";
const showSchema = new mongoose.Schema(
    {
        movie: { type: String, required: true, ref: 'Movie' },
        showDateTime: { type: Date, required: true },
        showPrice: { type: Number, required: true },
        venue: { type: String, required: false },
        occupiedSeats: { type: Object, default: {} }
    }, { minimize: false }
)
const Show = mongoose.model("Show", showSchema);
export default Show;