initMono(['../.net/MonoSanityClient.dll'], function () {
    var a = 12;
    var b = 13;
    var result = invokeMonoMethod('MonoSanityClient', 'MonoSanityClient', 'Examples', 'AddNumbers', [a, b]);
  });