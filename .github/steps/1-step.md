## Step 1: Basic Docker Authentication and Push

### 📖 Theory: Authentication and Basic Commands

GitHub Container Registry (GHCR) provides a secure way to store and distribute Docker images directly within your GitHub repository ecosystem. To publish images to GHCR, you need to authenticate using the `docker/login-action`, which securely handles credentials using GitHub's built-in `GITHUB_TOKEN`.

Basic Docker workflows use standard `docker build` and `docker push` commands within GitHub Actions. This approach gives you direct control over the build process and helps you understand the fundamental operations before moving to more automated solutions.

- **Authentication**: The `docker/login-action` manages secure login to container registries
- **Registry URL**: GHCR uses `ghcr.io` as the registry endpoint
- **Permissions**: Requires `packages: write` permission for publishing images
- **Image naming**: Follow the pattern `ghcr.io/OWNER/REPOSITORY/IMAGE_NAME:TAG`

#### References

- [GitHub Container Registry documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [docker/login-action usage](https://github.com/docker/login-action#github-container-registry)

### ⌨️ Activity: Create Basic Docker Publish Workflow

1. Go to `.github/workflows` directory and create a new workflow file named:

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

   This workflow will run on pushes to the `main` branch with permissions to read the repository contents and push packages to the GitHub Container Registry.

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

If the workflow fails, check the "Actions" tab for error logs. Common issues include:

- Incorrect indentation in YAML
- Typo in registry URL (`ghcr.io`)
- Missing permissions block
- Uppercase letters in the image name (Docker requires lowercase)

</details>
