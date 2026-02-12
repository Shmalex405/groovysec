# IBM QRadar Destination Setup Guide

This guide walks you through configuring IBM QRadar as a SOC/SIEM destination in Whiteout AI, forwarding audit events via syslog for SIEM correlation and compliance reporting.

## Overview

The IBM QRadar destination allows Whiteout AI to:
- Forward audit events to IBM QRadar via syslog for SIEM correlation, offense generation, and compliance reporting
- Leverage QRadar's rules engine to detect suspicious AI usage patterns and trigger offenses
- Integrate Whiteout AI event data with existing log sources for cross-correlation and threat analysis
- Support compliance reporting with centralized event collection and long-term retention

## Prerequisites

Before you begin, ensure you have:
- **Whiteout AI Admin** privileges
- **IBM QRadar** (7.4 or later) or **QRadar on Cloud (QRoC)**
- **QRadar Admin** access to configure log sources and custom event properties
- A syslog receiver configured on QRadar (typically TCP or UDP port `514`)
- Network connectivity from Whiteout AI to the QRadar syslog receiver (firewall rules allowing the configured port)

---

## Third-Party Setup

### Step 1: Configure a Syslog Log Source

Create a new log source in QRadar to receive events from Whiteout AI:

1. Log in to the QRadar Console
2. Navigate to **Admin** > **Log Sources**
3. Click **New Log Source**
4. On the **Select Log Source Type** page:

| Field | Value |
|-------|-------|
| **Log Source Type** | `Universal DSM` (or a custom DSM if available) |
| **Protocol Type** | `Syslog` |

5. Click **Next**
6. On the **Log Source Parameters** page:

| Field | Value |
|-------|-------|
| **Log Source Name** | `Whiteout AI` |
| **Log Source Description** | Audit events from Whiteout AI governance platform |
| **Log Source Identifier** | IP address or hostname of the Whiteout AI instance |
| **Enabled** | Yes |
| **Credibility** | `5` (default) |

7. Click **Next** and complete the wizard
8. Click **Deploy Changes** in the Admin panel to activate the log source

### Step 2: Configure the Syslog Receiver

Ensure QRadar's syslog listener is configured to accept events:

1. Navigate to **Admin** > **System Settings** > **Syslog**
2. Verify that the syslog listener is enabled on the appropriate port:

| Setting | Recommended Value |
|---------|-------------------|
| **Protocol** | TCP (recommended for reliability) or UDP |
| **Port** | `514` (default) or a custom port |
| **TLS** | Enable if supported (for encrypted syslog) |

3. If using a custom port, ensure it is open in your network configuration
4. Click **Save** if changes were made
5. Deploy changes

### Step 3: Create Custom Event Properties (CEP)

Define custom event properties to extract Whiteout AI fields from syslog messages:

1. Navigate to **Admin** > **Custom Event Properties**
2. Click **Add** for each property you want to extract:

| Property Name | Field Type | Regex Pattern (Example) |
|---------------|------------|-------------------------|
| `WhiteoutAI_EventType` | Text | `event_type="([^"]+)"` |
| `WhiteoutAI_UserEmail` | Text | `user_email="([^"]+)"` |
| `WhiteoutAI_Action` | Text | `action="([^"]+)"` |
| `WhiteoutAI_PolicyName` | Text | `policy_name="([^"]+)"` |
| `WhiteoutAI_RiskLevel` | Text | `risk_level="([^"]+)"` |

3. Test each regex against a sample Whiteout AI syslog message
4. Click **Save** and **Deploy Changes**

### Step 4: Create QRadar Rules (Optional)

Set up rules to generate offenses based on Whiteout AI events:

1. Navigate to **Offenses** > **Rules**
2. Click **Actions** > **New Event Rule**
3. Example rules:

**High-Risk AI Policy Violation**:
- When the event matches: `Log Source = Whiteout AI` AND `WhiteoutAI_RiskLevel = high`
- Action: Create offense with severity `8`
- Category: Policy Violation

**Repeated Policy Violations by Same User**:
- When: `Log Source = Whiteout AI` AND event count > 5 in 10 minutes, grouped by `WhiteoutAI_UserEmail`
- Action: Create offense with severity `7`
- Category: Anomalous Activity

4. Click **Save** and ensure rules are enabled

### Step 5: Verify Syslog Connectivity

Test that QRadar can receive syslog messages from the Whiteout AI network:

```bash
# From a machine in the same network as Whiteout AI:
logger -n qradar.example.com -P 514 -T "Test message from Whiteout AI"
```

In QRadar, check **Log Activity** for the test message.

---

## Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **SOC/SIEM Destinations**
3. Click **Add Destination** and select **IBM QRadar**
4. Enter the following credentials:

| Field | Description |
|-------|-------------|
| **Syslog Host** | QRadar syslog receiver hostname or IP (`syslog_host`) |
| **Syslog Port** | Syslog receiver port, typically `514` (`syslog_port`) |

5. Click **Save & Test Connection**

---

## Verification

Test your IBM QRadar destination:

1. **Connection Test**: Click **Test Connection** in the destination settings. Whiteout AI will send a test syslog message to QRadar.
2. **Log Activity**: In QRadar, navigate to **Log Activity** and filter by the `Whiteout AI` log source. Verify the test event appears.
3. **Event Parsing**: Click on an event and verify that custom event properties (e.g., `WhiteoutAI_EventType`, `WhiteoutAI_UserEmail`) are correctly extracted.
4. **End-to-End Test**: Trigger an auditable action in Whiteout AI and verify it appears in QRadar's Log Activity within a few seconds.
5. **Offense Generation**: If rules are configured, trigger a matching event and verify an offense is created in the **Offenses** tab.

---

## Troubleshooting

### Events Not Appearing in QRadar

- Verify the syslog host and port are correct in the Whiteout AI configuration
- Check network connectivity: ensure the QRadar syslog port is reachable from Whiteout AI (test with `telnet` or `nc`)
- Confirm the syslog listener is enabled on QRadar (**Admin** > **System Settings**)
- Check that no firewalls or network security groups are blocking the syslog port
- Review QRadar's **Admin** > **System Notifications** for log source errors

### Log Source Not Parsing Events

- Verify the log source type matches the syslog message format (use `Universal DSM` for flexible parsing)
- Check that the **Log Source Identifier** matches the IP address or hostname Whiteout AI sends from
- If events appear as **Unknown** or **Stored**, update the DSM mapping or custom event properties
- Run the **DSM Editor** to test message parsing

### Custom Event Properties Not Extracting

- Verify the regex patterns match the actual syslog message format
- Test the regex in QRadar's CEP editor using a real event payload
- Ensure there are no escaping issues in the regex (QRadar uses Java regex syntax)
- Redeploy changes after modifying CEPs

### Duplicate Events

- Check if multiple log sources are configured for the same Whiteout AI instance
- Verify that the log source identifier is unique
- Review the **Auto Detection** settings to prevent QRadar from creating additional log sources automatically

### Syslog Message Truncation

- By default, syslog messages may be truncated at 1024 bytes (UDP) or 2048 bytes (TCP)
- Use TCP for larger payloads
- In QRadar, increase the maximum syslog payload size under **Admin** > **System Settings** if needed

---

## Security Considerations

- **Use TCP over UDP**: TCP provides reliable, ordered delivery of syslog messages. UDP may drop messages under network congestion.
- **Enable TLS (Syslog over TLS)**: If supported, configure syslog over TLS to encrypt events in transit between Whiteout AI and QRadar.
- **Restrict Network Access**: Use firewall rules to limit which systems can send syslog messages to QRadar. Allow only Whiteout AI egress IPs on the syslog port.
- **Log Source Validation**: Configure QRadar to validate the source IP of incoming syslog messages to prevent spoofing.
- **Monitor Log Source Health**: Set up QRadar system notifications to alert when the Whiteout AI log source stops receiving events or encounters errors.
- **Protect QRadar Credentials**: Restrict access to the QRadar Admin console. Only authorized security personnel should manage log sources and rules.
- **Retention Policies**: Configure appropriate retention policies in QRadar for Whiteout AI events based on your compliance requirements (e.g., 90 days, 1 year, 7 years).
- **Regular Audits**: Periodically review QRadar rules, offenses, and log source configurations to ensure they remain aligned with your organization's security policy.
