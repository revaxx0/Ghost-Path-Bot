const BANNED_WORDS = [
  'amk', 'aq', 'sg', 'siktir', 'sik', 'piç', 'orospu', 'orospuçocu', 'ananı', 'anani',
  'babanı', 'babani', 'göt', 'got', 'yarrak', 'amcık', 'amcik', 'sikerim',
  'mal', 'salak', 'aptal', 'gerizekalı', 'embesil', 'ezik',
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'motherfucker', 'dick',
  'porn', 'sex', 'nsfw',
];

const PERSONAL_INFO_PATTERNS = [
  { pattern: /\b\d{11}\b/, type: 'TC Kimlik Numarası' },
  { pattern: /\b(05\d{2}|5\d{3})[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}\b/, type: 'Telefon Numarası' },
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, type: 'E-posta Adresi' },
  { pattern: /\b\d{16}\b/, type: 'Kredi Kartı Numarası' },
  { pattern: /\b(?:adres|address|yaşadığım yer|oturduğum)\s*[:：]\s*.{10,}/i, type: 'Adres Bilgisi' },
];

const INVITE_PATTERN = /(discord\.(gg|com\/invite)\/\w+)/gi;
const MENTION_LIMIT = 5;
const REPEAT_LIMIT = 3;
const MAX_LINKS = 3;

class AutoMod {
  constructor(client) {
    this.client = client;
    this.messageCache = new Map();
    this.contentCache = new Map();
  }

  async checkMessage(message) {
    if (message.author.bot) return null;
    if (!message.guild) return null;

    const content = message.content;
    const violations = [];

    const personalInfo = this.hasPersonalInfo(content);
    if (personalInfo) {
      violations.push({ type: `Kişisel Bilgi: ${personalInfo}`, severity: 3 });
    }

    if (this.hasBannedWords(content.toLowerCase())) {
      violations.push({ type: 'Kötü Kelime', severity: 2 });
    }

    if (this.hasInvite(content)) {
      violations.push({ type: 'Davet Linki', severity: 2 });
    }

    if (this.isSpam(message)) {
      violations.push({ type: 'Spam', severity: 3 });
    }

    if (this.hasExcessMentions(message)) {
      violations.push({ type: 'Aşırı Mention', severity: 2 });
    }

    if (this.hasExcessLinks(content)) {
      violations.push({ type: 'Aşırı Link', severity: 1 });
    }

    if (violations.length > 0) {
      return violations;
    }

    return null;
  }

  hasPersonalInfo(content) {
    for (const { pattern, type } of PERSONAL_INFO_PATTERNS) {
      if (pattern.test(content)) return type;
    }
    return null;
  }

  hasBannedWords(content) {
    const words = content.split(/\s+/);
    for (const word of words) {
      const clean = word.replace(/[^a-zA-ZığüşöçİĞÜŞÖÇ0-9]/g, '');
      if (BANNED_WORDS.some(bw => clean.includes(bw))) return true;
    }
    return BANNED_WORDS.some(bw => content.includes(bw));
  }

  hasInvite(content) {
    return INVITE_PATTERN.test(content);
  }

  hasExcessMentions(message) {
    const mentions = message.mentions.users.size + message.mentions.roles.size + (message.mentions.everyone ? 1 : 0);
    return mentions > MENTION_LIMIT;
  }

  hasExcessLinks(content) {
    const links = (content.match(/https?:\/\/[^\s]+/g) || []).length;
    return links > MAX_LINKS;
  }

  isSpam(message) {
    const now = Date.now();
    const key = `${message.author.id}`;

    const recent = this.messageCache.get(key) || [];
    const recentMsgs = recent.filter(t => now - t < 5000);
    recentMsgs.push(now);
    this.messageCache.set(key, recentMsgs.slice(-10));
    if (recentMsgs.length >= 6) return true;

    const cKey = `c:${message.author.id}`;
    const recentContent = this.contentCache.get(cKey) || [];
    const similar = recentContent.filter(c => now - c.time < 10000 && c.content === message.content);
    similar.push({ content: message.content, time: now });
    this.contentCache.set(cKey, similar.slice(-10));
    if (similar.length >= REPEAT_LIMIT) return true;

    return false;
  }
}

module.exports = AutoMod;
