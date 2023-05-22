export function validator(body) {
    const { title, description } = body;

    if (!title || !description) {
        const errorField = title ? 'descrição' : 'título';
        const responseError = {
            erro: `Ops... O campo ${errorField} é Obrigatório!`
        }

        return { responseError }
    }

    return body
}