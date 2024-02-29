# PandaPolls


**PandaPolls**: Democracia para todos!

Cansado de tomar decisões sozinho? Seus amigos não se decidem nem sobre qual o melhor lugar para ir? Relaxa, o PandaPolls chegou para salvar o dia!

O que é o PandaPolls?

É uma aplicação simples e poderosa para você criar enquetes e coletar a opinião dos seus amigos, familiares ou da galera da internet.


## Funcionalidades

- Cria enquetes
- Busca enquetes específicas
- Realização de votos em enquetes
- Exibição de resultados em tempo real


## Instalação

Clone o projeto em sua máquina local

```bash
  git clone https://github.com/fausantosdev/panda-polls.git
```

Instale as dependências

```bash
  npm install
```

OBS: crie um .env com suas definições de acordo com o .env.example
## Documentação da API
Crie enquetes em segundos:

#### Cria uma enquete

```http
  POST /polls
```
No corpo da requisição, envie um json com o título de sua enquete e as opções a serem votadas: 
```json
{
    "title": "Título da enquete",
    "options": [ "Opção 1", "Opção 2", "Opção 3" ]
}
```
Retorno: 
```json
{
	"poolId": "c5bseb92-a941-48xf-a520-dfd425dac68d"
}
```

#### Retorna uma enquete

```http
  GET /polls/${pollId}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `pollId`      | `string` | **Obrigatório**. O ID da enquete que você quer |

Retorno: 
```json
{
	"poll": {
		"id": "8c83104c-e535-4dec-a3e9-66a455dc7ea6",
		"title": "Título de sua Enquete",
		"options": [
			{
				"id": "8c83104c-e535-4dec-a3e9-66a455dc7ea6",
				"title": "Opção 1",
				"score": 1
			},
			{
				"id": "8c83104c-e535-4dec-a3e9-66a455dc7ea6",
				"title": "Opção 2",
				"score": 0
			}
		]
	}
}
```

#### Realiza um voto em uma opção de uma enquete específica

```http
  POST polls/${pollId}/votes
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `pollId`      | `string` | **Obrigatório**. O ID da enquete que você quer votar |

```json
{
    	"optionId": "c5bseb92-a941-48xf-a520-dfd425dac68d"
}
```
Retorno:
```json
{
	"pandaPollsSessionId": "c5bseb92-a941-48xf-a520-dfd425dac68d"
}
```
Obs: salva um cookie para que um mesmo usuário não vote várias vezes

#### Exibe os resultados em tempo real

```http
  ws://url/polls/${pollId}/votes
```
Esta rota permite que você se conecte a um canal WebSocket para receber atualizações em tempo real sobre a enquete com o ID especificado.

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `pollId`      | `string` | **Obrigatório**. O ID da enquete que você quer votar |





## 🚀 Sobre mim


Olá, pessoal!

Sou Flávio Santos, um desenvolvedor curioso e apaixonado por tecnologia. Adoro aprender coisas novas e me aventurar em diferentes áreas do desenvolvimento.

Minha paixão por tecnologia me motiva a buscar constantemente novos desafios e aprimorar minhas habilidades. Acredito que a tecnologia tem o poder de transformar o mundo e quero fazer parte dessa transformação.

Espero que você goste do meu trabalho! 🤓


## Referência

 - [Esta aplicação foi desenvolvida na trilha NodeJS da NLW Expert, evento da Rocketseat](https://www.rocketseat.com.br/)
