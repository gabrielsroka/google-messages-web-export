// Export chat conversation from https://messages.google.com/web to text and JSON.
// Usage in DevTools Console:
//   exportConversation();                      // Writes conversation as text
//   exportConversation({ returnJson: true });  // returns JSON
//
// Optional clipboard:
//   copy(exportConversation());
//   copy(JSON.stringify(exportConversation({ returnJson: true }), null, 2));

function exportConversation(options = {}) {
	const { returnJson = false, meLabel = "Me" } = options;

	const conversation = document.querySelector("mw-conversation-container");
	if (!conversation) return returnJson ? [] : "";

	const partnerName =
		conversation.querySelector("mws-header")?.textContent.trim() || "Partner";

	const items = Array.from(
		conversation.querySelectorAll(
			"mws-tombstone-message-wrapper, mws-message-wrapper"
		)
	);

	let currentDate = "";
	let tombstoneTime = null;

	const messages = [];
	const lines = [];

	function getTombstoneDateTime(text) {
		const raw = (text || "").replace(/\u00A0/g, " ").trim();
		if (!raw) return { date: "", time: null };

		const [date, time] = raw.split(" · ").map(s => s?.trim());
		return { date: date || "", time: time || null };
	}

	function getMessageText(wrapper) {
		const parts = wrapper.querySelectorAll("mws-message-part-content");
		if (!parts.length) return "";

		const out = [];

		parts.forEach(part => {
			const clone = part.cloneNode(true);

			// Remove link previews
			clone.querySelectorAll("mws-link-preview-decorator").forEach(el => el.remove());

			if (clone.querySelector("mws-lottie-animation")) {
				out.push("[Animated emoji]");
				clone.querySelectorAll("mws-lottie-animation").forEach(el => el.remove());
			}

			if (clone.querySelector("mws-image")) {
				out.push("[Image]");
				clone.querySelectorAll("mws-image").forEach(el => el.remove());
			}

			if (clone.querySelector("mws-audio-player")) {
				out.push("[Audio]");
				clone.querySelectorAll("mws-audio-player").forEach(el => el.remove());
			}

			const text = clone.innerText.trim();
			if (text) out.push(text);
		});

		return out.join("\n");
	}


	function getMessageTime(wrapper) {
		const ts = wrapper.querySelector("mws-absolute-timestamp");
		return ts ? ts.textContent.trim() : null;
	}

	function isOutgoing(wrapper) {
		return wrapper.getAttribute("is-outgoing") === "true";
	}

	for (const item of items) {
		switch (item.nodeName) {
			case "MWS-TOMBSTONE-MESSAGE-WRAPPER": {
				const { date, time } = getTombstoneDateTime(item.textContent);
				if (date) currentDate = date;
				tombstoneTime = time;
				break;
			}

			case "MWS-MESSAGE-WRAPPER": {
				const text = getMessageText(item);
				const messageTime = getMessageTime(item);

				const time = messageTime ?? tombstoneTime ?? "";
				tombstoneTime = null;

				const name = isOutgoing(item) ? meLabel : partnerName;

				const entry = { date: currentDate, time, name, text };

				messages.push(entry);
				lines.push(
					`[${entry.date}${entry.time ? ", " + entry.time : ""}] ${entry.name}:\n${entry.text}`
				);
				break;
			}
		}
	}

	return returnJson ? messages : lines.join("\n\n");
}
