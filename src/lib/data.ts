export const lessons = [
  {
    id: 1,
    title: "Password Basics",
    duration: 15,
    content: {
      title: "Lesson 1: Mastering Password Basics",
      sections: [
        {
          heading: "What Makes a Strong Password?",
          text: "A strong password is your first line of defense. It's a unique combination of characters that is difficult for others to guess. The key ingredients are length, complexity, and unpredictability.",
        },
        {
          heading: "Why is a Strong Password Important?",
          points: [
            "It protects your personal information like emails, photos, and financial data.",
            "It prevents unauthorized access to your social media and other online accounts.",
            "A single compromised password can lead to a domino effect if you reuse it across multiple sites.",
          ],
        },
        {
          heading: "Best Practices for Password Creation",
          list: [
            "Length is Key: Aim for at least 12-16 characters.",
            "Mix It Up: Combine uppercase letters, lowercase letters, numbers, and special characters (!@#$%).",
            "Avoid the Obvious: Steer clear of personal information like your name, birthday, or common words like 'password123'.",
            "Use a Passphrase: Think of a memorable sentence like 'CorrectHorseBatteryStaple!' and modify it.",
          ],
        },
      ],
    },
  },
  {
    id: 2,
    title: "Two-Factor Authentication",
    duration: 12,
    content: {
      title: "Lesson 2: Two-Factor Authentication (2FA)",
      sections: [
        {
          heading: "What is 2FA?",
          text: "Two-Factor Authentication adds a second layer of security to your online accounts. It requires you to provide two different types of identification to log in: something you know (your password) and something you have (like your phone).",
        },
        {
          heading: "Why is 2FA a Game-Changer?",
          points: [
            "It makes it significantly harder for attackers to gain access, even if they steal your password.",
            "You get alerted when someone tries to log in, as you'll receive a code or prompt.",
            "It's one of the most effective ways to secure your most important accounts (email, banking, etc.).",
          ],
        },
        {
          heading: "Types of 2FA",
          list: [
            "SMS-based: A code is sent to your phone via text message.",
            "Authenticator Apps: Apps like Google Authenticator or Authy generate time-sensitive codes.",
            "Hardware Keys: A physical USB key (like a YubiKey) that you plug in to authenticate.",
            "Biometrics: Using your fingerprint or face to verify your identity.",
          ],
        },
      ],
    },
  },
  {
    id: 3,
    title: "Phishing & Social Engineering",
    duration: 20,
    content: {
      title: "Lesson 3: Spotting Phishing & Social Engineering",
      sections: [
        {
          heading: "What is Phishing?",
          text: "Phishing is a fraudulent attempt to obtain sensitive information such as usernames, passwords, and credit card details by disguising as a trustworthy entity in an electronic communication, typically email.",
        },
        {
          heading: "Common Red Flags",
          points: [
            "Urgent or threatening language that creates a sense of panic.",
            "Spelling and grammar mistakes are common in phishing emails.",
            "Requests for personal information. Legitimate companies will rarely ask for this via email.",
            "Mismatched URLs. Hover over links to see where they really go before clicking.",
          ],
        },
      ],
    },
  },
  {
    id: 4,
    title: "Malware & Ransomware",
    duration: 18,
    content: {
      title: "Lesson 4: Understanding Malware & Ransomware",
       sections: [
        {
          heading: "What is Malware?",
          text: "Malware, short for malicious software, is any software intentionally designed to cause damage to a computer, server, client, or computer network. This includes viruses, worms, Trojan horses, and spyware.",
        },
        {
            heading: "What is Ransomware?",
            text: "Ransomware is a type of malware that encrypts your files, making them inaccessible. The attackers then demand a ransom payment in exchange for the decryption key."
        },
        {
          heading: "How to Protect Yourself",
          points: [
            "Keep your software updated to patch security vulnerabilities.",
            "Use a reputable antivirus program and keep it running.",
            "Be cautious about downloading files or clicking links from unknown sources.",
            "Regularly back up your important files to an external drive or cloud service.",
          ],
        },
      ],
    },
  },
  {
    id: 5,
    title: "Safe Browsing Habits",
    duration: 10,
    content: {
      title: "Lesson 5: Developing Safe Browsing Habits",
       sections: [
        {
          heading: "The Basics of Safe Browsing",
          text: "Practicing safe browsing habits is crucial for protecting your privacy and security online. It involves being mindful of the websites you visit and the information you share.",
        },
        {
          heading: "Key Habits to Develop",
          list: [
            "Look for HTTPS: Ensure websites use 'https://' encryption, indicated by a lock icon in the address bar.",
            "Be Wary of Public Wi-Fi: Avoid accessing sensitive accounts on unsecured public networks. Use a VPN if you must.",
            "Manage Cookies: Regularly clear your browser's cookies and cache to remove tracking data.",
            "Think Before You Click: Be skeptical of pop-ups, ads, and links that seem too good to be true.",
          ],
        },
      ],
    },
  },
];

export const quizQuestions = [
  {
    question: "Which of the following is the STRONGEST password?",
    options: ["password123", "P@ssw0rd!2023", "qwerty12345", "admin1234"],
    correctAnswer: "P@ssw0rd!2023",
  },
  {
    question: "What does '2FA' stand for?",
    options: ["Two-Form Authentication", "Two-Factor Authentication", "Two-Fold Authentication", "Two-File Authentication"],
    correctAnswer: "Two-Factor Authentication",
  },
  {
    question: "You receive an email from your bank asking you to click a link and verify your account details. What should you do?",
    options: ["Click the link and enter your details", "Ignore the email", "Go to your bank's website directly and log in there", "Reply with your account number"],
    correctAnswer: "Go to your bank's website directly and log in there",
  },
  {
    question: "What is the primary purpose of antivirus software?",
    options: ["To speed up your computer", "To block ads", "To detect and remove malware", "To back up your files"],
    correctAnswer: "To detect and remove malware",
  },
  {
    question: "Which of these is a sign of a secure website?",
    options: ["It has a lot of pop-up ads", "The address starts with 'http://'", "The address starts with 'https://'", "It asks for your password immediately"],
    correctAnswer: "The address starts with 'https://'",
  },
];

export const badges = [
    { id: 1, name: "First Password Checked", description: "Checked your very first password.", unlocked: true, date: "5 days ago" },
    { id: 2, name: "Email Guardian", description: "Checked 5 emails for breaches.", unlocked: true, date: "3 days ago" },
    { id: 3, name: "Quiz Master", description: "Completed 10 quizzes.", unlocked: true, date: "Yesterday" },
    { id: 4, name: "Learning Path", description: "Completed your first lesson.", unlocked: true, date: "2 days ago" },
    { id: 5, name: "Security Expert", description: "Reached 1000 XP.", unlocked: true, date: "1 week ago" },
    { id: 6, name: "Streak Starter", description: "Logged in for 3 consecutive days.", unlocked: true, date: "Today"},
    { id: 7, name: "Strong Password Creator", description: "Created 5 passwords with 'Strong' rating.", unlocked: true, date: "Today" },
    { id: 8, name: "Daily Challenger", description: "Completed your first daily challenge.", unlocked: true, date: "4 days ago" },
    { id: 9, name: "Certified", description: "Complete all lessons and pass the final exam.", unlocked: false, progress: "5/10" },
    { id: 10, name: "Platinum Member", description: "Reach 2500 XP.", unlocked: false, progress: "1250/2500" },
    { id: 11, name: "Breach Spotter", description: "Identified an email in a breach.", unlocked: false, progress: "0/1" },
    { id: 12, name: "Password Generator Pro", description: "Generated 10 secure passwords.", unlocked: false, progress: "3/10" },
    { id: 13, name: "Perfect Quizzer", description: "Score 100% on a quiz.", unlocked: false, progress: "0/1" },
    { id: 14, name: "Weekly Warrior", description: "Maintain a 7-day login streak.", unlocked: false, progress: "3/7" },
    { id: 15, name: "All Rounder", description: "Use all 4 main tools in one day.", unlocked: false, progress: "2/4" },
];
