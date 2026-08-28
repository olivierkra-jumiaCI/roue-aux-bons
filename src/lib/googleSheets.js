export async function callAppsScript(action, payload = {}) {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    throw new Error('APPS_SCRIPT_URL manquant dans .env.local');
  }

  const response = await fetch(url, {
    method: 'POST',
    // Apps Script requires follow redirects, and usually text/plain or no-cors for direct browser calls,
    // but from Node.js (Next.js backend) standard POST works fine if we handle redirects.
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, ...payload }),
    // Important for Apps Script Web Apps
    redirect: 'follow' 
  });

  if (!response.ok) {
    throw new Error(`Apps Script Error: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

export async function checkHasPlayedToday(email) {
  const data = await callAppsScript('checkLimit', { email });
  return data.hasPlayed;
}

export async function logPlayHistory(name, email, phone, result) {
  // We no longer log it separately, the 'spin' action in Apps Script does both logging and claiming
  return true; 
}

export async function getAvailableVouchersCount() {
  try {
    const data = await callAppsScript('getVouchersCount');
    return data.count || 0;
  } catch (error) {
    console.error("Error getting vouchers count:", error);
    return 0;
  }
}

export async function claimVoucher(name, email, phone, address) {
  // This function is now combined with the spin action
  throw new Error("Use handleSpin API instead");
}

export async function processSpinResult(name, email, phone, address, result) {
  return await callAppsScript('spin', { name, email, phone, address, result });
}

export async function getAdminStats() {
  try {
    return await callAppsScript('getStats');
  } catch (error) {
    console.error("Error getting stats:", error);
    return { totalPlays: 0, wins: 0, losses: 0, winners: [] };
  }
}
