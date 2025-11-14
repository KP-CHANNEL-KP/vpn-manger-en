// Cloudflare Pages Worker (ES Module Syntax)
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const redirects = {
      '/go/vpn-setup': 'https://raw.githubusercontent.com/KP-CHANNEL-KP/KP-VPN-MANGER/main/setup.sh',
      // နောက်ထပ် လိုချင်တဲ့ လင့်ခ်များ ထပ်ထည့်နိုင်ပါတယ်။
    };

    if (path in redirects) {
      const destinationURL = redirects[path];
      
      // ** ၁။ redirect အစား original URL မှ content ကို ဆွဲယူပါ။ **
      const response = await fetch(destinationURL);
      
      // ** ၂။ Header များကို ပြောင်းလဲနိုင်ရန် response အသစ် ဖန်တီးပါ။ **
      const newResponse = new Response(response.body, response);
      
      // ** ၃။ Content-Disposition Header ကို ထည့်သွင်းပြီး download ကို အတင်းအကျ ခိုင်းစေပါ။ **
      //    (filename="setup.sh" အမည်ဖြင့် download လုပ်စေရန်)
      newResponse.headers.set('Content-Disposition', 'attachment; filename="setup.sh"');
      
      // ** ၄။ Content-Type ကိုလည်း shell script အဖြစ် သတ်မှတ်ပါ။ (လိုအပ်ပါက) **
      newResponse.headers.set('Content-Type', 'text/x-sh');
      
      return newResponse;
    }

    return new Response('Link Not Found', { status: 404 });
  },
};
