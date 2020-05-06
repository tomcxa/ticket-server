const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();

app.use(koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true,
}));

app.use(async (ctx, next) => {
    const origin = ctx.request.get('Origin');
    if (!origin) {
        return await next();
    }
    const headers = { 'Access-Control-Allow-Origin': '*', };
    if (ctx.request.method !== 'OPTIONS') {
        ctx.response.set({ ...headers });
        try {
            return await next();
        } catch (e) {
            e.headers = { ...e.headers, ...headers };
            throw e;
        }
    }
    if (ctx.request.get('Access-Control-Request-Method')) {
        ctx.response.set({
            ...headers,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
        });
        if (ctx.request.get('Access-Control-Request-Headers')) {
            ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
        }
        ctx.response.status = 204; // No content
    }
});


const tickets = [
    {
        id: 1,
        short: 'Trali vali',
        full: 'Trali vali oborvali',
        status: false,
        time: 223,
    },
    {
        id: 2,
        short: 'Trali 1213412414',
        full: 'Trali vali oborvali 23112313123123',
        status: true,
        time: 223,
    }
];

app.use(async (ctx) => {
    console.log(ctx.request.body);
    console.log(ctx.request.url);
    //получаем все тикеты
    if (ctx.request.method === 'GET'
        && ctx.request.path === '/tickets') {
        ctx.response.body = JSON.stringify(tickets);
    }
    //получаем тикет по идентификатору
    if (ctx.request.method === 'GET'
        && ctx.request.path === '/tickets/:id') {
        const id = ctx.query.id;
        const ticket = [...tickets].find((ticket) => ticket.id == id);
        ctx.response.body = JSON.stringify(ticket);
    }
    //создаем новый тикет и генерируем ему идентификатор
    if (ctx.request.method === 'POST'
        && ctx.request.path === '/tickets') {
        const ticket = ctx.request.body;
        ticket.id = tickets.length ? ([...tickets].pop().id) + 1 : 0;
        ticket.status = false;
        ticket.time = new Date().toLocaleString();
        tickets.push(ticket);
        ctx.response.body = JSON.stringify(ticket);
    }
    // удаляем тикет по идентификатору;
    if (ctx.request.method === 'DELETE'
        && ctx.request.path === '/tickets/:id') {
        const id = ctx.query.id;
        const index = tickets.findIndex((ticket) => ticket.id == id);
        tickets.splice(index, 1);
        ctx.response.body = id;
    }
    // редактируем тикет по идентификатору;
    if (ctx.request.method === 'PUT'
        && ctx.request.path === '/tickets') {
        const data = ctx.request.body;
        const ticket = tickets.find((el) => el.id == data.id);
        console.log(ticket)
        ticket.short = data.short;
        ticket.full = data.full;
        ticket.time = new Date().toLocaleString();
        console.log(data)
        ctx.response.body = JSON.stringify(ticket);
    }
    // обновление статуса тикета по идентификатору;
    if (ctx.request.method === 'PATCH'
        && ctx.request.path === '/tickets/:id') {
        const id = ctx.query.id;
        const ticket = tickets.find((ticket) => ticket.id == id);
        ticket.status = !ticket.status;
        ctx.response.body = ticket.id;
    }
});

const port = process.env.PORT || 7070;

const server = http.createServer(app.callback()).listen(port);