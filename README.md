<div align="center">

# 📨 InviteWave

**Invite your LinkedIn connections to follow your page with one paste.**

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Browser Console](https://img.shields.io/badge/Browser-Console_Script-0A66C2?style=for-the-badge&logo=googlechrome&logoColor=white)
![No Install](https://img.shields.io/badge/Install-None-1DA077?style=for-the-badge)

</div>

---

## 📖 About

InviteWave is a tiny JavaScript snippet that you run in your browser console. On your LinkedIn Page's **Invite to follow** screen, it loads your connections, ticks up to 250 of them (your invite credits) and clicks **Invite** for you. No more selecting people one by one.

## ✨ What it does

- 📥 Loads the full list by clicking **Show more** for you
- ✅ Selects up to **250** connections (easy to change)
- 🐢 Waits half a second between clicks to stay gentle
- 📨 Clicks the **Invite** button when selection is done
- 🧾 Prints its progress in the console so you can follow along

## 🚀 How to Use

1. Log in to LinkedIn and open your Page as an admin
2. Click **Invite to follow** so your connections list appears
3. Optional: use the search box to narrow down who you want to invite
4. Open the browser tools with `F12` (or right click → **Inspect**) and go to the **Console** tab
5. Clear the console (the 🚫 icon, or `Ctrl + L`)
6. Copy the script from [`inviteAll.js`](inviteAll.js) (or the box below), paste it into the console and press **Enter**
7. Watch the console. When you see `Invite button clicked!`, the invites are on their way 🎉

> 💡 If your browser blocks pasting, type `allow pasting` in the console, press Enter, then paste the script again.

## ⚙️ Settings

Both settings sit at the top of the script.

| Setting | Default | What it does |
|---------|---------|--------------|
| `TOTAL_CREDITS` | `250` | How many connections to select. Set it to the number of invite credits you have left |
| `DELAY` | `500` | Milliseconds to wait between each selection |

<details>
<summary><b>📜 Click to view the script</b></summary>

```js
(async function inviteAll() {
  const TOTAL_CREDITS = 250;
  const DELAY = 500; // ms between clicks to avoid rate limiting

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function getUncheckedCheckboxes() {
    return Array.from(document.querySelectorAll(
      'input.ember-checkbox[type="checkbox"]:not(:checked)'
    ));
  }

  async function loadAllResults() {
    let attempts = 0;
    while (attempts < 50) {
      const showMoreBtn = document.querySelector(
        '.scaffold-finite-scroll__load-button'
      );
      if (!showMoreBtn || showMoreBtn.disabled) break;
      showMoreBtn.click();
      await sleep(1500);
      attempts++;
    }
    console.log('Finished loading results.');
  }

  async function selectUpTo(limit) {
    let selected = 0;
    while (selected < limit) {
      const checkboxes = getUncheckedCheckboxes();
      if (checkboxes.length === 0) {
        console.log('No more unchecked checkboxes found.');
        break;
      }
      for (const cb of checkboxes) {
        if (selected >= limit) break;
        cb.click();
        selected++;
        await sleep(DELAY);
      }
      // Try loading more if we haven't hit the limit yet
      if (selected < limit) {
        const showMoreBtn = document.querySelector(
          '.scaffold-finite-scroll__load-button'
        );
        if (!showMoreBtn || showMoreBtn.disabled) break;
        showMoreBtn.click();
        await sleep(1500);
      }
    }
    return selected;
  }

  async function clickInviteButton() {
    const inviteBtn = document.querySelector(
      'button.artdeco-button--primary:not([disabled])'
    );
    if (inviteBtn) {
      inviteBtn.click();
      console.log('Invite button clicked!');
    } else {
      console.warn('Invite button not found or still disabled.');
    }
  }

  console.log('Loading all results...');
  await loadAllResults();

  console.log(`Selecting up to ${TOTAL_CREDITS} connections...`);
  const totalSelected = await selectUpTo(TOTAL_CREDITS);
  console.log(`Selected ${totalSelected} connections.`);

  await sleep(1000);
  await clickInviteButton();

})();
```

</details>

## ⚠️ Disclaimer

InviteWave is not affiliated with or endorsed by LinkedIn. Automating actions on LinkedIn may go against its User Agreement, so use it at your own risk, keep the delay, and do not run it over and over.

## 👤 Author

Made by **Pranav Regmi** ([@athristt](https://github.com/athristt))
