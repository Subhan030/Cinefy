import express from "express";
import { getNowPlayingMovies, addShow, getShow, getShows, deleteShow, getHeroMovie, getShowById } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

showRouter.get("/now-playing", getNowPlayingMovies);
showRouter.get("/hero-movie", getHeroMovie);
showRouter.post("/add-show", addShow);
showRouter.get("/all", getShows)
showRouter.get("/instance/:showId", getShowById)
showRouter.get("/:movieId", getShow)
showRouter.post("/delete", deleteShow)

export default showRouter;
