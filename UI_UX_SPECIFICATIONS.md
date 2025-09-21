# UI/UX Specifications - Multi-Account Platform

## 1. Account Switcher

### Location: Top Navigation Bar
```
┌─────────────────────────────────────────────────────┐
│ [≡] SocialScheduler  [Client: Acme Corp ▼] [👤] [⚙] │
└─────────────────────────────────────────────────────┘
```

### Dropdown Design
```
┌────────────────────────────────┐
│ 🔍 Search accounts...          │
├────────────────────────────────┤
│ ⭐ FAVORITES                   │
│ 🏢 Acme Corp          3 alerts │
│ 🏢 TechStartup        ✓        │
├────────────────────────────────┤
│ 📁 RETAIL CLIENTS              │
│ 🏢 Fashion Brand               │
│ 🏢 Sports Store      2 pending │
├────────────────────────────────┤
│ 📁 B2B CLIENTS                 │
│ 🏢 SaaS Company                │
│ 🏢 Consulting Firm             │
├────────────────────────────────┤
│ [+] Add New Client Account     │
│ [⚙] Manage Accounts            │
└────────────────────────────────┘
```

### Features:
- Keyboard shortcut: `Cmd/Ctrl + K` for quick switch
- Recent accounts at top
- Visual indicators for pending items
- Group/folder organization
- Search with fuzzy matching

---

## 2. Multi-Account Dashboard

### Layout Options

#### Grid View (Default)
```
┌─────────────────────────────────────────────────────────┐
│ Total Overview: 6 Clients | 142 Scheduled | 28K Reach  │
├─────────────────────────────────────────────────────────┤
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
│ │ Acme Corp     │ │ TechStartup   │ │ Fashion Brand │ │
│ │ 📊 2.3K reach │ │ 📊 5.1K reach │ │ 📊 8.2K reach │ │
│ │ 📅 12 posts   │ │ 📅 8 posts    │ │ 📅 15 posts   │ │
│ │ ⚠️ 3 pending  │ │ ✅ All good   │ │ ⚠️ 1 failed   │ │
│ └───────────────┘ └───────────────┘ └───────────────┘ │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
│ │ Sports Store  │ │ SaaS Company  │ │ Consulting    │ │
│ │ 📊 1.8K reach │ │ 📊 3.4K reach │ │ 📊 900 reach  │ │
│ │ 📅 6 posts    │ │ 📅 10 posts   │ │ 📅 4 posts    │ │
│ │ ✅ All good   │ │ 🔄 2 review   │ │ ✅ All good   │ │
│ └───────────────┘ └───────────────┘ └───────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### Comparison View
```
┌──────────────────────────────────────────────────────────────┐
│ Compare Accounts     [Period: Last 7 days ▼] [Metrics ▼]   │
├────────────┬──────────┬──────────┬──────────┬──────────────┤
│ Account    │ Followers│ Eng. Rate│ Posts    │ Best Perf.   │
├────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Acme Corp  │ 12.5K ↑  │ 3.2% ↑   │ 12       │ Product launch│
│ TechStartup│ 8.3K ↑   │ 5.1% ↓   │ 8        │ Blog share   │
│ Fashion    │ 25.1K ↑  │ 4.7% →   │ 15       │ Sale post    │
└────────────┴──────────┴──────────┴──────────┴──────────────┘
```

---

## 3. Content Discovery Hub

### Tab Navigation
```
[Trending] [Top Creators] [Competitors] [Saved Ideas] [AI Suggestions]
```

### Trending Content Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Platform: [All ▼] Industry: [Tech ▼] Region: [US ▼]       │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐  │
│ │ 🔥 TRENDING NOW                                       │  │
│ │ #TechTuesday - 125K posts                            │  │
│ │ AI Generated Art - 89K engagement                     │  │
│ │ @creator_name viral thread - 45K shares              │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│ │ Twitter     │ │ Instagram   │ │ LinkedIn    │         │
│ │ [Preview]   │ │ [Preview]   │ │ [Preview]   │         │
│ │ 12K likes   │ │ 45K likes   │ │ 890 likes   │         │
│ │ [💾] [🔄]   │ │ [💾] [🔄]   │ │ [💾] [🔄]   │         │
│ └─────────────┘ └─────────────┘ └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### Top Creators View
```
┌──────────────────────────────────────────────────────────────┐
│ Discover Creators    [Niche: Marketing ▼] [Platform: All ▼]│
├──────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 👤 @marketingguru                              [Follow]│ │
│ │ 125K followers | 5.2% engagement | Marketing Tech      │ │
│ │ Recent posts: [📊] [📊] [📊] [📊] [📊]              │ │
│ │ Best time: Tue 2PM | Avg likes: 2.3K                  │ │
│ └────────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 👤 @socialmediaexpert                          [Follow]│ │
│ │ 89K followers | 7.1% engagement | Social Strategy      │ │
│ │ Recent posts: [📊] [📊] [📊] [📊] [📊]              │ │
│ │ Best time: Wed 10AM | Avg likes: 1.8K                 │ │
│ └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Smart Calendar

### Multi-Account Calendar View
```
┌────────────────────────────────────────────────────────────────┐
│ Calendar    [Week View ▼]  Accounts: [All ▼]  [+ New Post]   │
├────────────────────────────────────────────────────────────────┤
│      │  Mon 15  │  Tue 16  │  Wed 17  │  Thu 18  │  Fri 19   │
├──────┼──────────┼──────────┼──────────┼──────────┼───────────┤
│ 9 AM │ [AC] FB  │          │ [TS] TW  │          │ [FB] IG   │
│      │ Product  │          │ Blog     │          │ Sale      │
├──────┼──────────┼──────────┼──────────┼──────────┼───────────┤
│ 12PM │          │ [AC] IG  │          │ [SS] FB  │           │
│      │          │ Lunch    │          │ Event    │           │
├──────┼──────────┼──────────┼──────────┼──────────┼───────────┤
│ 3 PM │ 🤖 Best  │          │ 🤖 Best  │          │ [SC] LI   │
│      │   time   │          │   time   │          │ Article   │
├──────┼──────────┼──────────┼──────────┼──────────┼───────────┤
│ 6 PM │ [TS] IG  │ [AC] TW  │          │ [FB] FB  │           │
│      │ Story    │ Thread   │          │ Video    │           │
└──────┴──────────┴──────────┴──────────┴──────────┴───────────┘

Legend: [AC]=Acme Corp, [TS]=TechStartup, [FB]=Fashion Brand
🤖 = AI suggested optimal posting time
```

### Drag & Drop Features
- Drag posts between time slots
- Drag between days
- Multi-select for bulk operations
- Visual conflict warnings

---

## 5. Analytics Dashboard

### Account Comparison Mode
```
┌─────────────────────────────────────────────────────────────┐
│ Analytics    Comparing: [3 accounts ▼]  [Last 30 days ▼]  │
├─────────────────────────────────────────────────────────────┤
│                    Engagement Rate Comparison               │
│     8% ┤ ╭─── Acme Corp                                   │
│     6% ┤ ╱╲   ── TechStartup                               │
│     4% ┤╱  ╲  .... Fashion Brand                            │
│     2% ┤    ╲                                               │
│     0% └────────────────────────────────────────            │
│        1w    2w    3w    4w                                │
├─────────────────────────────────────────────────────────────┤
│ Top Metrics          Acme    Tech    Fashion               │
│ Total Reach         23.5K   45.2K    89.1K                │
│ Avg. Engagement      3.2%    5.1%     4.7%                │
│ Best Platform         FB      TW       IG                 │
│ Growth Rate          +12%    +8%     +23%                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Approval Workflow Interface

### Approval Queue
```
┌─────────────────────────────────────────────────────────────┐
│ Pending Approvals (5)    [Filter: All ▼]  [Sort: Urgent ▼]│
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────┐ │
│ │ 🔴 URGENT - Acme Corp                                 │ │
│ │ Post: "Product launch announcement..."                │ │
│ │ Platforms: FB, TW, LI | Schedule: Today 3PM          │ │
│ │ Status: Awaiting client approval (2 hours left)      │ │
│ │ [View] [Approve] [Request Changes] [Reject]          │ │
│ └───────────────────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ 🟡 Fashion Brand                                      │ │
│ │ Post: "Summer collection preview..."                  │ │
│ │ Platforms: IG, FB | Schedule: Tomorrow 10AM          │ │
│ │ Status: Internal review needed                        │ │
│ │ [View] [Approve] [Request Changes] [Reject]          │ │
│ └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Approval Modal
```
┌─────────────────────────────────────────────────────────────┐
│ Review Post - Acme Corp                              [X]   │
├─────────────────────────────────────────────────────────────┤
│ Preview:                                                    │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ [Post preview with media]                           │   │
│ │                                                      │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ Approval History:                                          │
│ ✅ Created by Sarah (2 hours ago)                          │
│ ✅ Reviewed by Marketing Team (1 hour ago)                 │
│ ⏳ Awaiting client approval                                │
│                                                             │
│ Comments:                                                  │
│ [Add your feedback...]                                     │
│                                                             │
│ [Approve & Publish] [Request Changes] [Reject]            │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Team Activity Feed

### Activity Stream
```
┌─────────────────────────────────────────────────────────────┐
│ Team Activity    [All accounts ▼]  [All actions ▼]        │
├─────────────────────────────────────────────────────────────┤
│ 👤 Sarah • 5 min ago                                       │
│    Created 3 posts for Acme Corp → Review needed          │
│                                                             │
│ 👤 Mike • 12 min ago                                       │
│    Approved Fashion Brand campaign → Publishing at 3PM     │
│                                                             │
│ 🤖 System • 30 min ago                                     │
│    TechStartup post published successfully on Twitter      │
│                                                             │
│ 👤 Client (Acme) • 1 hour ago                             │
│    Requested changes on tomorrow's posts                   │
│                                                             │
│ 👤 Lisa • 2 hours ago                                      │
│    Updated analytics report for Sports Store              │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Mobile Responsive Designs

### Mobile Account Switcher
```
┌─────────────┐
│ ☰  Acme ▼ 👤│
├─────────────┤
│ Dashboard   │
│ Calendar    │
│ Analytics   │
│ Discovery   │
└─────────────┘
```

### Mobile Multi-Account View
```
┌─────────────┐
│ All Accounts│
├─────────────┤
│ Acme Corp   │
│ 12 scheduled│
│ 3 pending ⚠️│
├─────────────┤
│ TechStartup │
│ 8 scheduled │
│ All good ✅ │
├─────────────┤
│ [See all]   │
└─────────────┘
```

---

## 9. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Quick account switch |
| `Cmd/Ctrl + N` | New post |
| `Cmd/Ctrl + A` | Switch to analytics |
| `Cmd/Ctrl + D` | Open discovery hub |
| `Cmd/Ctrl + Shift + A` | Select all accounts |
| `A` then `1-9` | Quick switch to account 1-9 |
| `Escape` | Close modal/dropdown |

---

## 10. Design System Updates

### Color Coding
- Each client account gets an assigned color
- Colors used consistently across calendar, analytics, etc.
- User can customize colors

### Status Indicators
- 🟢 Active/Good
- 🟡 Warning/Pending
- 🔴 Error/Urgent
- 🔵 Information
- ⚫ Archived/Inactive

### Icons
- 🏢 Client account
- 📁 Account group
- 📅 Scheduled
- ⚠️ Needs attention
- ✅ Approved
- 🔄 In review
- 📊 Analytics
- 🔥 Trending
- 💡 AI suggestion
- 👥 Team activity

---

This UI/UX specification provides a comprehensive blueprint for implementing multi-account features while maintaining a clean, intuitive interface that scales from single users to large agencies.