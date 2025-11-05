export function generatePassword(): string {
    const base = "nowtec";
    const symbols = "!@#$%^&*()_+-=[]{}|;:',.<>/?`~";
    let randomSymbols = "";
    for (let i = 0; i < 5; i++) {
      randomSymbols += symbols[Math.floor(Math.random() * symbols.length)];
    }
    return base + randomSymbols;
  }
  