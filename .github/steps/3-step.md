## Step 3: Dynamic Tagging with Metadata

Great job! You now have a workflow that uses the official Docker actions to build and push your image for multiple platforms.

Now, let's make our workflow smarter by automatically generating different image tags and labels for different event triggers.

### 📖 Theory: Lifecycle-Based Publishing

In a real-world software development lifecycle (SDLC), you often need to publish Docker images at various stages, not just when pushing to the main branch.

For these different events you may choose different tagging strategies, here are some examples of common scenarios:

- **New commits**:
  - Mutable tags using branch names (e.g., `main`).
  - Unique tags using the commit SHA (e.g., `28270383c5854bf`).
- **Pull Request updates**: Build and publish for testing (e.g., `pr-123`).
- **Version releases**: Stable versions triggered by Git tags (e.g., `v1.0.0`, `latest`).

Managing all these different tagging strategies manually in your workflow file can get messy. The `docker/metadata-action` simplifies this by automatically generating Docker tags and labels based on the Git context (branch, tag, or PR) that triggered the workflow.

| Event             | Ref                        | Tags                       |
| :---------------- | :------------------------- | :------------------------- |
| Pull Request      | `refs/pull/2/merge`        | `pr-2`                     |
| Push Branch       | `refs/heads/main`          | `main`                     |
| Push Tag          | `refs/tags/v1.2.3`         | `v1.2.3`, `latest`         |
| Push Tag          | `refs/tags/v2.0.8-beta.67` | `v2.0.8-beta.67`, `latest` |
| workflow_dispatch | `refs/heads/main`          | `main`                     |

### ⌨️ Activity: Adding additional triggers and metadata action

Let's update our workflow to support multiple triggers and use the metadata action for dynamic docker image tagging.

1. Edit the `.github/workflows/docker-publish.yml` file.
1. Update the event triggers part of the workflow to include all of the following triggers

   ```yaml
   on:
     push:
       branches:
         - main
       tags:
         - "v*"
     pull_request:
       branches:
         - main
     workflow_dispatch:
   ```

1. Add a step to extract metadata (tags, labels) for Docker images

  ❗️ Place it before the `docker/build-push-action` step.

  ```yaml
  - name: Extract metadata (tags, labels) for Docker
    id: meta
    uses: docker/metadata-action@v5
    with:
      images: ghcr.io/{{ full_repo_name | lower }}/stackoverflown
  ```

1. Update the `docker/build-push-action` step to use the generated tags and labels.

   ```yaml
   - name: Build and push Docker image
     uses: docker/build-push-action@v5
     with:
       context: .
       push: true
       platforms: linux/amd64,linux/arm64
       provenance: true
       tags: {% raw %}${{ steps.meta.outputs.tags }}{% endraw %}
       labels: {% raw %}${{ steps.meta.outputs.labels }}{% endraw %}
   ```

  Ensure the yaml indentation is setup correctly!

  > 💡 **Tip:** You can run `actionlint` command in the terminal to see if the workflow is properly formatted.

1. Commit and push your changes to the `main` branch.
1. As you commit your changes Mona will prepare the next step in this exercise!
