import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    // TODO: GET weather data from city name
    const { cityName } = req.body;
    if (!cityName) {
        return res.status(400).json({ error: 'City name is required' });
    }
    try {
        const weatherData = await WeatherService.getWeatherForCity(cityName);
        res.json(weatherData);
        // TODO: save city to search history
        await HistoryService.write(cityName);
        return;
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to return weather data' });
    }
});
// TODO: GET search history
router.get('/', async (res) => {
    try {
        const history = await HistoryService.read();
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve search history' });
    }
});
// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req: Request, res: Response) => {});
export default router;
