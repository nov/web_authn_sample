const cose_alg_ES256 = -7;
const cose_alg_RS256 = -257;
const password_less = {};
const authAbortController = new AbortController();

password_less.register = (event) => {
  event.preventDefault();

  let user = {
    id: new TextEncoder().encode(email.value),
    name: email.value,
    displayName: email.value
  };

  let public_key_options = {
    challenge: new TextEncoder().encode(challenge),
    rp: {
      name: document.title
    },
    pubKeyCredParams: [{
      type: 'public-key',
      alg: cose_alg_ES256
    }, {
      type: 'public-key',
      alg: cose_alg_RS256
    }],
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
    },
    user: user
  };
  console.log('register', public_key_options);

  navigator.credentials.create({
    publicKey: public_key_options
  }).then((attestation) => {
    console.log('register succeeded', attestation);
    event.target.attestation_object.value = __url_safe_b64_encode__(attestation.response.attestationObject);
    event.target.client_data_json.value   = __url_safe_b64_encode__(attestation.response.clientDataJSON);
    event.target.submit();
  }, error).finally(() => {
    event.target.commit.disabled = false;
  });
};

password_less.autocreate = (email) => {
  let user = {
    id: new TextEncoder().encode(email),
    name: email,
    displayName: email
  };

  let public_key_options = {
    challenge: new TextEncoder().encode(challenge),
    rp: {
      name: document.title
    },
    pubKeyCredParams: [{
      type: 'public-key',
      alg: cose_alg_ES256
    }, {
      type: 'public-key',
      alg: cose_alg_RS256
    }],
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
    },
    user: user
  };
  console.log('autocreate', public_key_options);

  navigator.credentials.create({
    mediation: 'conditional',
    publicKey: public_key_options
  }).then((attestation) => {
    console.log('autocreate succeeded', attestation);
    binding_form.attestation_object.value = __url_safe_b64_encode__(attestation.response.attestationObject);
    binding_form.client_data_json.value   = __url_safe_b64_encode__(attestation.response.clientDataJSON);
    binding_form.submit();
  }, error);
}

password_less.authenticate = (event) => {
  event.preventDefault();

  let public_key_options = {
    challenge: new TextEncoder().encode(challenge),
    userVerification: 'required'
  };
  console.info('authenticate', public_key_options);

  navigator.credentials.get({
    publicKey: public_key_options
  }).then((assertion) => {
    console.log('authenticate succeeded', assertion);
    event.target.credential_id.value      = __url_safe_b64_encode__(assertion.rawId);
    event.target.authenticator_data.value = __url_safe_b64_encode__(assertion.response.authenticatorData);
    event.target.client_data_json.value   = __url_safe_b64_encode__(assertion.response.clientDataJSON);
    event.target.signature.value          = __url_safe_b64_encode__(assertion.response.signature);
    event.target.submit();
  }, error).finally(() => {
    event.target.commit.disabled = false;
  });
};

password_less.autocomplete = (form) => {
  let public_key_options = {
    challenge: new TextEncoder().encode(challenge),
    userVerification: 'required'
  };
  console.info('activate autocomplete', public_key_options);

  navigator.credentials.get({
    mediation: 'conditional',
    publicKey: public_key_options
  }).then((assertion) => {
    console.log('autocomplete succeeded', assertion);
    form.credential_id.value      = __url_safe_b64_encode__(assertion.rawId);
    form.authenticator_data.value = __url_safe_b64_encode__(assertion.response.authenticatorData);
    form.client_data_json.value   = __url_safe_b64_encode__(assertion.response.clientDataJSON);
    form.signature.value          = __url_safe_b64_encode__(assertion.response.signature);
    form.submit();
  }, error);
};

const error = (reason) => {
  document.reason = reason;
  alert(reason);
  console.log('error', reason);
};

const __url_safe_b64_encode__ = (array_buffer) => {
  let uint8_array = new Uint8Array(array_buffer).reduce(
    (s, byte) => s + String.fromCharCode(byte), ''
  );
  return btoa(uint8_array).replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
};

if (typeof TextEncoder === "undefined") {
  TextEncoder=function TextEncoder(){};
  TextEncoder.prototype.encode = function encode(str) {
      "use strict";
      var Len = str.length, resPos = -1;
      // The Uint8Array's length must be at least 3x the length of the string because an invalid UTF-16
      //  takes up the equivelent space of 3 UTF-8 characters to encode it properly. However, Array's
      //  have an auto expanding length and 1.5x should be just the right balance for most uses.
      var resArr = typeof Uint8Array === "undefined" ? new Array(Len * 1.5) : new Uint8Array(Len * 3);
      for (var point=0, nextcode=0, i = 0; i !== Len; ) {
          point = str.charCodeAt(i), i += 1;
          if (point >= 0xD800 && point <= 0xDBFF) {
              if (i === Len) {
                  resArr[resPos += 1] = 0xef/*0b11101111*/; resArr[resPos += 1] = 0xbf/*0b10111111*/;
                  resArr[resPos += 1] = 0xbd/*0b10111101*/; break;
              }
              // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
              nextcode = str.charCodeAt(i);
              if (nextcode >= 0xDC00 && nextcode <= 0xDFFF) {
                  point = (point - 0xD800) * 0x400 + nextcode - 0xDC00 + 0x10000;
                  i += 1;
                  if (point > 0xffff) {
                      resArr[resPos += 1] = (0x1e/*0b11110*/<<3) | (point>>>18);
                      resArr[resPos += 1] = (0x2/*0b10*/<<6) | ((point>>>12)&0x3f/*0b00111111*/);
                      resArr[resPos += 1] = (0x2/*0b10*/<<6) | ((point>>>6)&0x3f/*0b00111111*/);
                      resArr[resPos += 1] = (0x2/*0b10*/<<6) | (point&0x3f/*0b00111111*/);
                      continue;
                  }
              } else {
                  resArr[resPos += 1] = 0xef/*0b11101111*/; resArr[resPos += 1] = 0xbf/*0b10111111*/;
                  resArr[resPos += 1] = 0xbd/*0b10111101*/; continue;
              }
          }
          if (point <= 0x007f) {
              resArr[resPos += 1] = (0x0/*0b0*/<<7) | point;
          } else if (point <= 0x07ff) {
              resArr[resPos += 1] = (0x6/*0b110*/<<5) | (point>>>6);
              resArr[resPos += 1] = (0x2/*0b10*/<<6)  | (point&0x3f/*0b00111111*/);
          } else {
              resArr[resPos += 1] = (0xe/*0b1110*/<<4) | (point>>>12);
              resArr[resPos += 1] = (0x2/*0b10*/<<6)    | ((point>>>6)&0x3f/*0b00111111*/);
              resArr[resPos += 1] = (0x2/*0b10*/<<6)    | (point&0x3f/*0b00111111*/);
          }
      }
      if (typeof Uint8Array !== "undefined") return resArr.subarray(0, resPos + 1);
      // else // IE 6-9
      resArr.length = resPos + 1; // trim off extra weight
      return resArr;
  };
  TextEncoder.prototype.toString = function(){return "[object TextEncoder]"};
  try { // Object.defineProperty only works on DOM prototypes in IE8
      Object.defineProperty(TextEncoder.prototype,"encoding",{
          get:function(){if(TextEncoder.prototype.isPrototypeOf(this)) return"utf-8";
                         else throw TypeError("Illegal invocation");}
      });
  } catch(e) { /*IE6-8 fallback*/ TextEncoder.prototype.encoding = "utf-8"; }
  if(typeof Symbol!=="undefined")TextEncoder.prototype[Symbol.toStringTag]="TextEncoder";
}
