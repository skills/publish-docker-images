## Step 2: Level up with Docker Actions

Good job!

That commit you just did should have triggered the first run of your workflow and published a Docker image to the GitHub Container Registry under your account.

Let's see how to download that image and enhance the workflow with open source docker actions.

### 📖 Theory: Specialized Docker Actions

Similarly to `docker/login-action` that you just used, there are also other open source actions that provide significant improvements for container workflows. Let's take a look at some of them:

| Action                       | Benefits                                                                                                          |
| :--------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `docker/build-push-action`   | Supports multi-platform builds, secrets, remote cache, and advanced build features                                |
| `docker/setup-qemu-action`   | Enables building for different architectures (e.g., ARM64)                                                        |
| `docker/setup-buildx-action` | Enables multi-platform builds, cache export, and full [BuildKit](https://docs.docker.com/build/buildkit/) support |

> [!TIP]
> These actions, like many others, are available in the [GitHub Marketplace](https://github.com/marketplace?query=docker&type=actions).

### ⌨️ (optional) Activity: Pull and run your docker image

The commit from your previous step should have triggered the first run of your workflow and published a Docker image to the GitHub Container Registry.

Let's pull that image and run it in your codespace to see the game running!

1. Go to your repository [main page](https://github.com/{{ full_repo_name }})
1. On the right side, under the **Packages** section, click `{{ repo_name | lower }}/stackoverflown`

   <img width="300" alt="Image showing packages button" src="https://github.com/user-attachments/assets/ada36c5a-f1ce-4125-9008-661976ffaa15" />


1. Copy the command that starts with `docker pull ...`
1. Back in your codespace, run that command in the terminal to download the image from the container registry
1. Verify the image is available locally by running:

   ```bash
   docker images
   ```

1. Let's create a Docker container from that image and see the stackoverflown app running!

   ```bash
   docker run -p 8080:80 ghcr.io/{{ full_repo_name | lower }}/stackoverflown:main
   ```

1. You can access the application through the `Ports` tab - on port `8080`

   <img width="600" alt="Image showing the ports tab" src="https://github.com/user-attachments/assets/80944d79-898a-43f9-94a0-6a9cc153f38d" />


   > ✨ Take a moment to play the game!

1. You can stop the application from running by hitting `Ctrl + C` back in the terminal

> [!NOTE]
> Throughout this exercise, you will publish different versions of the image. You can always use these same steps to pull and run any version you create, even if not explicitly instructed.

### ⌨️ Activity: Leverage open source Docker Actions

Let's edit the workflow to use the official Docker actions for a more robust and feature-rich build process.

1. Open the `.github/workflows/docker-publish.yml` file.
1. Remove your existing `Build and push Docker image` step with `docker` commands. We will replace that with open source actions.

    > ❗ **Caution:** Only remove the `Build and push Docker image` step. Do **not** remove the steps with `actions/checkout` and `docker/login-action` actions.

   Now, add these following three steps in place of the `Build and push Docker image` step you just removed.

   These steps will set up QEMU for multi-architecture builds, set up Docker Buildx, and then build and push the Docker image with two different tags.

   ```yaml
   - name: Set up QEMU
     uses: docker/setup-qemu-action@v3
   - name: Set up Docker Buildx
     uses: docker/setup-buildx-action@v3
   - name: Build and push Docker image
     uses: docker/build-push-action@v6
     with:
       context: .
       push: true
       platforms: linux/amd64,linux/arm64
       tags: |
         ghcr.io/{{ full_repo_name | lower }}/stackoverflown:main
         ghcr.io/{{ full_repo_name | lower }}/stackoverflown:{% raw %}${{ github.sha }}{% endraw %}
   ```

   Ensure the yaml indentation is setup correctly!

   > 💡 **Tip:** You can run `actionlint` command in the terminal to see if the workflow is properly formatted.

   <details>
   <summary>Having trouble? 🤷 See full workflow file</summary><br/>

   In case you need it, here is the full content of the updated workflow file:

    ```yaml
    name: Docker Publish

    on:
      push:
        branches:
          - main

    permissions:
      contents: read
      packages: write
      
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
          - name: Set up QEMU
            uses: docker/setup-qemu-action@v3
          - name: Set up Docker Buildx
            uses: docker/setup-buildx-action@v3
          - name: Build and push Docker image
            uses: docker/build-push-action@v6
            with:
              context: .
              push: true
              platforms: linux/amd64,linux/arm64
              tags: |
                ghcr.io/{{ full_repo_name | lower }}/stackoverflown:main
                ghcr.io/{{ full_repo_name | lower }}/stackoverflown:{% raw %}${{ github.sha }}{% endraw %}
    ```

   </details>

1. Commit and push your changes to the `main` branch. As you push your changes Mona will check your work and prepare the next step in this exercise!
1. Monitor your workflow run in the [Actions](https://github.com/{{ full_repo_name }}/actions) tab of your repository and **ensure it completes successfully**.
