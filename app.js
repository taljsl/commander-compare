document.getElementById("add-deck").addEventListener("click", () => {
    const container = document.getElementById("deck-container");
    const deckCount = container.children.length + 1;
    const newBox = document.createElement("div");
    newBox.className = "deck-box";
  
    newBox.innerHTML = `
      <textarea placeholder="Enter deck ${deckCount} cards, one per line"></textarea>
      <button class="remove-deck">Remove</button>
    `;
  
    newBox.querySelector(".remove-deck").addEventListener("click", () => {
      newBox.remove();
    });
  
    container.appendChild(newBox);
  });
  
  document.getElementById("submit").addEventListener("click", () => {
    const decks = Array.from(document.querySelectorAll(".deck-box textarea"))
      .map(textarea => new Set(
        textarea.value
          .split("\n")
          .map(line => line.trim().replace(/^\d+\s+/, "")) // remove leading count
          .filter(card => card)
      ));
  
    const result = compareDecks(...decks);
  
    const resultPage = window.open("", "_blank");
    resultPage.document.write(`<html><head><title>Results</title><style>
      body { font-family: Arial; padding: 20px; }
      .section { margin-bottom: 30px; }
      pre { background: #f0f0f0; padding: 10px; border-radius: 5px; }
    </style></head><body>`);
  
    resultPage.document.write(`<h1>Deck Comparison Results</h1>`);
  
    resultPage.document.write(`<div class="section"><h2>Unique Cards Per Deck</h2>`);
    result.uniqueCards.forEach(deck => {
      resultPage.document.write(`<h3>Deck ${deck.deck} (${deck.count} unique)</h3><pre>${deck.cards.join("\n") || "None"}</pre>`);
    });
    resultPage.document.write(`</div>`);
  
    resultPage.document.write(`<div class="section"><h2>Common Cards (Appear in ≥2 decks)</h2><p>Total: ${result.commonCards.count} shared cards</p><pre>${result.commonCards.cards.join("\n")}</pre></div>`);
  
    resultPage.document.write(`</body></html>`);
  });
  
  function compareDecks(...decks) {
    const cardFrequency = new Map();
    for (const deck of decks) {
      for (const card of deck) {
        cardFrequency.set(card, (cardFrequency.get(card) || 0) + 1);
      }
    }
  
    const commonCards = new Set();
    for (const [card, count] of cardFrequency) {
      if (count >= 2) commonCards.add(card);
    }
  
    const uniqueCardsPerDeck = decks.map(deck => {
      const unique = new Set();
      for (const card of deck) {
        if (cardFrequency.get(card) === 1) unique.add(card);
      }
      return unique;
    });
  
    const result = {
      deckStats: decks.map((deck, i) => ({
        deckNumber: i + 1,
        totalCards: deck.size,
        fullDecklist: Array.from(deck).sort(),
      })),
      uniqueCards: uniqueCardsPerDeck.map((set, i) => ({
        deck: i + 1,
        count: set.size,
        cards: Array.from(set).sort(),
      })),
      commonCards: {
        count: commonCards.size,
        cards: Array.from(commonCards).sort(),
      },
    };
  
    return result;
  }
  