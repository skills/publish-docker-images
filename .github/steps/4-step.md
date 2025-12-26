## Step 4: Multi-Platform Support and PR Testing

### 📖 Theory: Cross-Platform Builds and CI

Modern applications need to run on different processor architectures. The `docker/setup-qemu-action` enables emulation for building images that target different platforms like ARM64 (Apple Silicon, Raspberry Pi) and AMD64 (Intel/AMD processors) from a single workflow.

Adding pull request triggers allows testing your Docker workflow before merging changes to main. This provides confidence that container builds work correctly and helps catch issues early in the development process.

- **Multi-platform builds**: Single workflow creates images for multiple CPU architectures
- **QEMU emulation**: Enables cross-platform builds on GitHub's x86_64 runners
- **Pull request testing**: Validates Docker workflows before merging code changes
- **CI/CD integration**: Complete pipeline from development to production deployment

#### References

- [Multi-platform builds with Buildx](https://docs.docker.com/buildx/working-with-buildx/#build-multi-platform-images)
- [GitHub Actions pull request triggers](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request)

### ⌨️ Activity: Add Multi-Platform and PR Support

1. Create a new branch named `feature/multi-platform`.
1. Edit `.github/workflows/docker-publish.yml`.
1. Update the workflow trigger to include `pull_request` events for the `main` branch.

   ```yaml
   on:
     push:
       branches: ["main"]
       tags: ["v*.*.*"]
     pull_request:
       branches: ["main"]
   ```

1. Add a step to set up QEMU using `docker/setup-qemu-action@v3` before the Buildx setup step.
   ```yaml
   - name: Set up QEMU
     uses: docker/setup-qemu-action@v3
   ```
1. Update the `docker/build-push-action` step to include platforms.
   ```yaml
   - name: Build and push Docker image
     uses: docker/build-push-action@v5
     with:
       context: .
       push: ${{ github.event_name != 'pull_request' }}
       tags: ${{ steps.meta.outputs.tags }}
       labels: ${{ steps.meta.outputs.labels }}
       platforms: linux/amd64,linux/arm64
   ```
   _Note: We set `push` to false for pull requests to avoid publishing untested images._
1. Commit your changes and open a Pull Request to the `main` branch.

<details>
<summary>Having trouble? 🤷</summary><br/>

- Ensure `docker/setup-qemu-action` is placed before `docker/setup-buildx-action`.
- Check the `platforms` list is comma-separated without spaces.
- Verify the `push` condition correctly handles pull requests.

</details>
