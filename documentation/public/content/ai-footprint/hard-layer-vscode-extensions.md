# VS Code: block AI extensions with AllowedExtensions

**Where:** AI Footprint → **Controls** → **Hard layer**. Pick the scope (your whole organization, or one group), choose a format and **Download**. A decision's **Decision & reach** tab offers the same download.

It sets VS Code's `AllowedExtensions` policy, which is the `extensions.allowed` setting enforced by policy (VS Code 1.96 and later). The value allows everything except the blocked AI extensions:

```json
{"*": true, "saoudrizwan.claude-dev": false}
```

The more specific key wins, so each blocked extension id is refused and everything else stays allowed. VS Code won't install a refused extension and disables one that is already installed. Whiteout generates the file; you deploy it.

JetBrains plugin ids are listed as "not included": JetBrains IDEs have no equivalent policy.

## Import

- **macOS:** download the **macOS profile (.mobileconfig)** file. Its payload type is `com.microsoft.VSCode`, VS Code's own bundle id, and `AllowedExtensions` is a string holding the JSON. That is the layout of the sample profile VS Code ships in `Contents/Resources/app/policies` (VS Code 1.99 and later). Upload it as a custom profile on the device channel.
- **Windows:** download the **Windows registry (.reg)** file. It sets `HKLM\SOFTWARE\Policies\Microsoft\VSCode`, value `AllowedExtensions`, to the JSON string. Lead: check the value type on a test device. If you import the ADMX template that ships with VS Code into Intune or Group Policy, paste the value from the **JSON** file there instead.
- **Linux:** download the **JSON** file and save its `linux_policy_json` as `/etc/vscode/policy.json` (VS Code 1.106 and later).

`AllowedExtensions` is one policy. If you already set it, merge Whiteout's `false` entries into yours. If yours is an allowlist, leave out the `"*": true`.

## Test

1. Deploy to a test device group.
2. Restart VS Code. A blocked extension shows as not allowed in the Extensions view.
3. Open **Show Window Log**: it must report no policy error. VS Code ignores a policy with a syntax error.

## Roll back

Unassign or delete the profile. On Windows, delete the `AllowedExtensions` registry value; on Linux, delete `/etc/vscode/policy.json`. Then restart VS Code.

---

See [The hard layer](./ai-footprint/hard-layer.md) for what every file leaves out and how to test and roll back.
