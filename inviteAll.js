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
