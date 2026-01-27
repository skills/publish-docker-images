## Step 1: First interaction with GitHub Packages

You and your team have been working hard on an awesome web-based game called **Stackoverflown**. It's a hit, and now you want to **package and version** it for distribution so players everywhere can easily run it and deploy it on their servers.

<img alt="Screenshot of the Stackoverflown game" src="https://github.com/user-attachments/assets/8eb5fa0c-9282-459e-9d15-320c13f74263" width="900">

To make this happen efficiently, let's automate the process of packaging new versions of your app using GitHub Actions!

### 📖 Theory: About GitHub Packages and Container Registry

GitHub Packages is a platform for hosting and managing packages, including containers and other dependencies. It offers different package registries for commonly used package managers, such as:

- 🐳 **Docker**
- 📦 npm
- 💎 RubyGems
- 🪶 Apache Maven
- 🐘 Gradle
- 🔷 NuGet

GitHub Packages are associated with a GitHub account (User or Organization) namespace, not solely a repository. This is often beneficial because you may want to distribute a package and reuse a it across multiple repositories.

In this exercise we will setup automation to publish 🐳 **[Docker](https://docs.docker.com/get-started/docker-overview/)** images to **[GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)** (`ghcr.io`). We will need to ensure the `packages` `permission` is set so the GitHub Actions built-in `GITHUB_TOKEN` secret can be used for authenticating to the registry.


> [!NOTE]
> GitHub Packages is free for public repositories.
>
> For private repositories, there is a certain amount of free storage and data transfer each month. Check out [About billing for GitHub Packages](https://docs.github.com/en/billing/concepts/product-billing/github-packages) for details.

### ⌨️ Activity: Set up your development environment

Let's use **GitHub Codespaces** to set up a cloud-based development environment and work in it for the remainder of the exercise!

1. Right-click the below button to open the **Create Codespace** page in a new tab. Use the default configuration.

   [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/{{full_repo_name}}?quickstart=1)

1. Confirm the **Repository** field is your copy of the exercise, not the original, then click the green **Create Codespace** button.

   - ✅ Your copy: `/{{full_repo_name}}`
   - ❌ Original: `/skills/publish-docker-images`

1. Wait a moment for Visual Studio Code to fully load in your browser.

### ⌨️ Activity: Create Basic Docker Publish Workflow

Let's start off by creating a workflow to build and publish our **Stackoverflown** game as a docker image.

1. In your codespace, within the `.github/workflows` directory create a new workflow file named:

   ```text
   docker-publish.yml
   ```

1. Within that file, let's start by defining the workflow name, event trigger and permissions:

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
             docker build . --tag ghcr.io/{{ full_repo_name | lower }}/stackoverflown:main
             docker push ghcr.io/{{ full_repo_name | lower }}/stackoverflown:main
   ```

   This job checks out the repository code, authenticates to the GitHub Container Registry using `GITHUB_TOKEN`, builds the Docker image, and publishes it to the registry under your GitHub account.

   > 🪧 Note: The `docker build` follows the instructions in the 🐳 **Dockerfile** file present in the repository on how to package the application

1. Commit and push your changes to the `main` branch.
1. When you push your changes, the workflow you just created should also run for the first time. Monitor it in the [**Actions**](https://github.com/{{ full_repo_name }}/actions) tab and **ensure it completes successfully**.

<details>
<summary>Having trouble? 🤷</summary><br/>

If the workflow fails, check the **Actions** tab for error logs. Common issues include:

- Incorrect indentation in YAML. Try running `actionlint` command in the terminal and see if any errors show up.
- Uppercase letters in the image name (Docker requires lowercase)

</details>
