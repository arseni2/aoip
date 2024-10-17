import axios from 'axios';
import qs from 'qs';

export const makeQuery = async (msg) => {
    return axios.post("http://localhost:3000/api/message", {
        messages: [
            {
                text: `Создай смешной диалог между двумя случайными персонажами. Они обсуждают забавные ситуации из своей повседневной жизни, например, неожиданные проблемы, которые случились с ними на работе или в школе. Постарайся сделать диалог легким и веселым, добавь смешные комментарии и забавные повороты. На тему ${msg}`,
                role: "user"
            }
        ],
        max_tokens: 10000
    })
        .then(data => data.data)
}