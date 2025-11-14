// Cloudflare Pages Worker (ES Module Syntax)
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ဤနေရာတွင် သင့်ရဲ့ လမ်းကြောင်းအတိုနှင့် လမ်းကြောင်းအရှည်များကို ထည့်ပါ။
    const redirects = {
      // ** သင့်ရဲ့ လက်ရှိ Script Link ကို ဖုန်းကွယ်လိုက်သော လမ်းကြောင်း **
      '/go/vpn-setup': 'https://raw.githubusercontent.com/KP-CHANNEL-KP/KP-VPN-MANGER/main/setup.sh',
      
      // နောက်ထပ် လိုချင်တဲ့ လင့်ခ်များ ထပ်ထည့်နိုင်ပါတယ်။
      // '/go/another-link': 'https://example.com/another-long-link',
    };

    if (path in redirects) {
      const destinationURL = redirects[path];
      // 302 (ယာယီ) redirect ဖြင့် လမ်းကြောင်းပြောင်းခြင်း။
      return Response.redirect(destinationURL, 302);
    }

    // လမ်းကြောင်း မတွေ့ပါက 404 ပြန်ပေးခြင်း
    return new Response('Link Not Found', { status: 404 });
  },
};
