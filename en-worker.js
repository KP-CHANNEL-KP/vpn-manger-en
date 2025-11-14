/**
 * Cloudflare Worker: 
 * Features: Browser Block, Key Validation (MULTI/MASTER).
 * * ဖယ်ရှားပြီးသော အပိုင်းများ:
 * - Timezone Fix Logic (MMT) - (ဖယ်ရှားပြီး)
 * - License Key Default/Parsing Logic - (ဖယ်ရှားပြီး)
 * - IP Locking Logic (1DV) - (ဖယ်ရှားပြီး)
 * - Expiration Check (EXPIRY_LIST_URL ဖြင့် စစ်ဆေးခြင်း) - (ဖယ်ရှားပြီး)
 */

// ----------------------------------------------------------------------
const TARGET_SCRIPT_URL = "https://raw.githubusercontent.com/KP-CHANNEL-KP/KP-VPN-MANGER/main/setup.sh";
// ----------------------------------------------------------------------
const ALLOWED_USER_AGENTS = ['curl']; 
const LICENSE_NAMESPACE = 'LICENSES'; 

export default {
    async fetch(request, env) { 
        const userAgent = request.headers.get('User-Agent') || '';
        
        // ======================================================================
        // 🚫 1. Browser Block Check
        // ======================================================================
        if (!ALLOWED_USER_AGENTS.some(agent => userAgent.toLowerCase().includes(agent.toLowerCase()))) {
            return new Response("ဘားမှမသိချင်နဲ့ညီ အကိုမှလဲ ညီ့ကိုပြစရာ (လီး) ပဲရှိတယ်။😎", { status: 403 });
        }

        // ----------------------------------------------------------------------
        // 🔑 License Key ကို URL တွင် ပါရှိကြောင်း ဆွဲထုတ်ပါ။
        // ----------------------------------------------------------------------
        let licenseKey = request.url.split('/').pop(); 
        
        // 🔑 Key မပါရင် Block ပါ
        if (!licenseKey || licenseKey === '') {
            return new Response("License Key is missing in the request URL.", { status: 400 });
        }
        
        let keyData; 

        // ======================================================================
        // 🔑 2. Key Validation & Type Check (MASTER Key Check အပါအဝင်)
        // ======================================================================
        try {
            // KV ကနေ Key Value ကို JSON Format ဖြင့် ဆွဲထုတ်
            const keyJson = await env[LICENSE_NAMESPACE].get(licenseKey); 
            
            // 1. Invalid Key (KV ထဲမှာ မရှိခြင်း)
            if (keyJson === null) { 
                return new Response("Invalid License Key. Please contact the administrator.", { status: 403 });
            }
            
            // JSON String ကို Object အဖြစ် ပြောင်းလဲ
            keyData = JSON.parse(keyJson); 

            // 2. MASTER Key Check: MASTER Key ဆိုရင် Script ကို တန်းပို့မည်။
            if (keyData.type === 'MASTER') {
                console.log(`MASTER Key ${licenseKey} Access Granted.`);
                return fetchScript(TARGET_SCRIPT_URL);
            }

        } catch (e) {
            console.error(`Key Parsing/Validation Error: ${e.message}`);
            return new Response("An internal error occurred during key parsing or verification.", { status: 500 });
        }
        
        // ======================================================================
        // 3. Script Content ကို တောင်းယူပြီး ပေးပို့ပါမယ်။
        // ======================================================================
        return fetchScript(TARGET_SCRIPT_URL);
    }
};

/**
 * Script ကို fetch လုပ်ပြီး response ပြန်ပို့သော Function
 */
async function fetchScript(url) {
    const fetchOptions = {
        redirect: 'follow',
        cache: 'no-store' 
    };

    try {
        let response = await fetch(url, fetchOptions);
        
        const headers = new Headers(response.headers);
        headers.delete('x-served-by');
        
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: headers
        });
        
    } catch (error) {
        return new Response(`Error fetching script: ${error.message}`, { status: 500 });
    }
}
