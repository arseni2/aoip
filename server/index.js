import express from 'express';
import axios from 'axios';
import qs from 'qs';
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors())
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.post('/api/auth', async (req, res) => {
    const scope = 'GIGACHAT_API_PERS';
    const rqUID = '9108eaf5-d4f2-46ca-8d8e-133d813cc4d2';

    const data = qs.stringify({
        scope: scope
    });

    const config = {
        method: 'post',
        url: 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'RqUID': rqUID,
            'Authorization': 'Basic OTEwOGVhZjUtZDRmMi00NmNhLThkOGUtMTMzZDgxM2NjNGQyOjNlNDZlNjJmLWIzNWItNDljZS04NTZhLWJiYTg2Njk4ZWI5NA=='
        },
        data: data,
        maxBodyLength: Infinity
    };

    try {
        const response = await axios(config);
        const accessToken = response.data.access_token;
        res.json({ access_token: accessToken });
    } catch (error) {
        console.error('Ошибка при авторизации:', error.response ? error.response.data : error.message);
        res.status(error.response?.status || 500).json({
            error: 'Ошибка при авторизации',
            details: error.response ? error.response.data : error.message
        });
    }
});

const getAccessToken = async () => {
    const scope = 'GIGACHAT_API_PERS';
    const rqUID = '9108eaf5-d4f2-46ca-8d8e-133d813cc4d2';

    const data = qs.stringify({
        scope: scope
    });

    const config = {
        method: 'post',
        url: 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'RqUID': rqUID,
            'Authorization': 'Basic OTEwOGVhZjUtZDRmMi00NmNhLThkOGUtMTMzZDgxM2NjNGQyOjNlNDZlNjJmLWIzNWItNDljZS04NTZhLWJiYTg2Njk4ZWI5NA=='
        },
        data: data,
        maxBodyLength: Infinity
    };

    try {
        const response = await axios(config);
        return response.data.access_token;
    } catch (error) {
        console.error('Ошибка при авторизации:', error.response ? error.response.data : error.message);
        throw new Error('Не удалось получить токен доступа');
    }
};

app.post('/api/message', async (req, res) => {
    const { messages, temperature = 1, top_p = 1, max_tokens = 100 } = req.body;

    try {
        const accessToken = await getAccessToken();

        const config = {
            method: 'post',
            url: 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'X-Client-ID': '9108eaf5-d4f2-46ca-8d8e-133d813cc4d2',
                'X-Request-ID': '9108eaf5-d4f2-46ca-8d8e-133d813cc4d2',
                'X-Session-ID': '9108eaf5-d4f2-46ca-8d8e-133d813cc4d2',
                'Authorization': `Bearer ${accessToken}`
            },
            data: {
                model: "GigaChat-Pro",
                messages: messages,
                temperature: temperature,
                top_p: top_p,
                max_tokens: max_tokens
            }
        };

        const response = await axios(config);
        res.json(response.data);
    } catch (error) {
        console.error('Ошибка при получении ответа от модели:', error.response ? error.response.data : error.message);
        res.status(error.response?.status || 500).json({
            error: 'Ошибка при получении ответа от модели',
            details: error.response ? error.response.data : error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});