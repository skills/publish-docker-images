## Step 1: First interaction with GitHub Packages

### 📖 Theory: About GitHub Packages and Container Registry

GitHub Packages is a platform for hosting and managing packages, including containers and other dependencies. It offers different package registries for commonly used package managers, such as:

- 📦 npm
- 🐳 Docker
- 💎 RubyGems
- 🪶 Apache Maven
- 🐘 Gradle
- 🔷 NuGet

In this exercise we will setup automation to publish 🐳 Docker images to **GitHub Container Registry** (`ghcr.io`).

To authenticate to the GitHub Container Registry in GitHub Actions workflows, you must ensure the `packages` `permission` is set so the built-in `GITHUB_TOKEN` secret can be used as password.

### ⌨️ Activity: Set up your development environment

Let's use **GitHub Codespaces** to set up a cloud-based development environment and work in it for the remainder of the exercise!

1. Right-click the below button to open the **Create Codespace** page in a new tab. Use the default configuration.

   [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/{{full_repo_name}}?quickstart=1)

1. Confirm the **Repository** field is your copy of the exercise, not the original, then click the green **Create Codespace** button.

   - ✅ Your copy: `/{{full_repo_name}}`
   - ❌ Original: `/skills/publish-packages`

1. Wait a moment for Visual Studio Code to fully load in your browser.

### ⌨️ Activity: Create Basic Docker Publish Workflow

Let's start off with creating a workflow to build publish a docker image.

1. Within the `.github/workflows` directory create a new workflow file named:

   ```text
   docker-publish.yml
   ```

1. Define the workflow name, triggers, and permissions:

   ```yaml
   name: Docker Publish

   on:
     push:
       branches:
         - main

   permissions:
     contents: read
     packages: write
   ```

   This workflow will run on all commits pushed to the `main` branch with permissions to read the repository contents and push packages to the GitHub Container Registry.

1. Add the `build-and-push` job to the end of the file:

   ```yaml
   jobs:
     build-and-push:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v6
         - name: Log in to the Container registry
           uses: docker/login-action@v3
           with:
             registry: ghcr.io
             username: {% raw %}${{ github.actor }}{% endraw %}
             password: {% raw %}${{ secrets.GITHUB_TOKEN }}{% endraw %}
         - name: Build and push Docker image
           run: |
             docker build . --tag ghcr.io/{{ full_repo_name | lower }}/stackoverflown:latest
             docker push ghcr.io/{{ full_repo_name | lower }}/stackoverflown:latest
   ```

   This job checks out the code, logs in to the GitHub Container Registry using the `GITHUB_TOKEN` (which has `packages: write` permissions), and then builds and pushes the Docker image.

1. Commit and push your changes to the `main` branch.

<details>
<summary>Having trouble? 🤷</summary><br/>

If the workflow fails, check the **Actions** tab for error logs. Common issues include:

- Incorrect indentation in YAML
- Uppercase letters in the image name (Docker requires lowercase)

</details>
