

deploy-client: ## deploy the client directory
	vercel client/v2 --prod

serve-client: ## serve the client directory
	serve client/v2

deploy-server: ## deploy the API
	vercel server --prod

readme: ## generate the README file doctoc
	doctoc README.md --github
	doctoc ./workshops/*.md --github

