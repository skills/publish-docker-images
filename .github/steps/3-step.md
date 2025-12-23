## Step 3: Dynamic Tagging with Metadata

### 📖 Theory: Automated Tagging and Versioning

Hardcoding image tags like `:latest` is not sustainable for real applications. The `docker/metadata-action` automatically generates appropriate tags and labels based on Git context - creating different tags for branches, pull requests, and version tags.

This action extracts information from Git references and GitHub events to create meaningful Docker image metadata. It supports semantic versioning patterns, branch-based tagging, and pull request labeling, making your container workflow more professional and maintainable.

- **Semantic versioning**: Automatic tag generation from Git tags (v1.0.0 → 1.0.0, 1.0, 1)
- **Branch tagging**: Different tags for different branches (main → latest, develop → edge)
- **Metadata extraction**: Pulls information from Git context and GitHub events
- **Label generation**: Creates OCI-compliant labels for better image documentation

#### References

- [docker/metadata-action documentation](https://github.com/docker/metadata-action#about)
- [Docker image tagging best practices](https://docs.docker.com/develop/dev-best-practices/)

### ⌨️ Activity: Implement Automated Tagging

1. Edit `.github/workflows/docker-publish.yml`.
1. Update the workflow trigger to include `tags` matching `v*` pattern.
   ```yaml
   on:
     push:
       branches: ["main"]
       tags: ["v*.*.*"]
   ```
1. Add a step to extract metadata (tags, labels) for Docker using `docker/metadata-action@v5`. Place it after the login step.
   ```yaml
   - name: Extract metadata (tags, labels) for Docker
     id: meta
     uses: docker/metadata-action@v5
     with:
       images: ghcr.io/{{ full_repo_name | lower }}
   ```
1. Update the `docker/build-push-action` step to use the generated tags and labels.
   ```yaml
   - name: Build and push Docker image
     uses: docker/build-push-action@v5
     with:
       context: .
       push: true
       tags: ${{ steps.meta.outputs.tags }}
       labels: ${{ steps.meta.outputs.labels }}
   ```
1. Commit and push your changes to the `main` branch.
1. Create and push a new tag to test the versioning (e.g., `v1.0.0`).
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

<details>
<summary>Having trouble? 🤷</summary><br/>

- Make sure you gave the metadata step an `id: meta` so you can reference its outputs.
- Ensure the `tags` trigger pattern matches the tag you push (e.g., `v*.*.*` matches `v1.0.0`).
- Check that you are using `${{ steps.meta.outputs.tags }}` and `${{ steps.meta.outputs.labels }}` correctly.

</details>
