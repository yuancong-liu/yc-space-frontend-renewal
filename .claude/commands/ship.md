Review all uncommitted changes (staged and unstaged) and do the following:

1. **Analyze changes**: Run `git status` and `git diff HEAD` to understand all modifications. Also run `git log -1` to see the last commit for context.

2. **Group into logical commits**: Split the changes into thematic groups (e.g. separate config changes from feature code, separate test changes from implementation, etc.). Each group should represent a single coherent unit of work.

3. **Commit each group**: For each group, stage only the relevant files and create a commit with a conventional commit message (`feat:`, `fix:`, `chore:`, `test:`, `ci:`, `refactor:`, `docs:`, etc.). Always append the co-author trailer:

   ```
   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
   ```

4. **Push to remote**: After all commits are created, push the current branch to origin.

5. **Create PR if not on develop branch**: Check the current branch with `git branch --show-current`. If it is NOT `develop`, create a pull request targeting `develop` using:

   ```
   gh pr create --title "..." --body "..."
   ```

   The PR title should summarize the overall change. The body should use this format:

   ```
   ## Summary
   - bullet points of what changed

   ## Test plan
   - how to verify the changes

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   ```

   Return the PR URL at the end.

   If already on `develop`, skip the PR step.
