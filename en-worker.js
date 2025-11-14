// Cloudflare Pages Worker (Proxy & Force Download)
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const redirects = {
      // 1. စတင် download လုပ်မယ့် link
      '/go/vpn-setup': 'https://raw.githubusercontent.com/KP-CHANNEL-KP/KP-VPN-MANGER/main/setup.sh',
      
      // 2. setup.sh အတွင်းမှ ဥပမာ Internal Link ကို ဖုန်းကွယ်ခြင်း
      '/go/iizin-script': 'https://raw.githubusercontent.com/KP-CHANNEL-KP/KP-VPN-MANGER/main/main/zzn/iizin.sh',
      
      // ** သင့်ရဲ့ ကျန်တဲ့ Internal Link အရှည်များရှိပါက ဤနေရာတွင် ဆက်ထည့်ပါ **
      // '/go/another-internal-file': 'https://original-link-to-another-file.com/file.sh',
    };

    if (path in redirects) {
      const destinationURL = redirects[path];
      
      // Fetch the content and prepare for forced download
      const response = await fetch(destinationURL);
      const newResponse = new Response(response.body, response);
      
      // Force browser to download instead of displaying code
      newResponse.headers.set('Content-Disposition', 'attachment; filename="setup.sh"');
      newResponse.headers.set('Content-Type', 'text/x-sh');
      
      return newResponse;
    }

    return new Response('Link Not Found', { status: 404 });
  },
};
