const cose_alg_ECDSA_w_SHA256 = -7;
const password_less = {};

password_less.register = (event) => {
  event.preventDefault();

  let user = {
    id: new TextEncoder().encode(email.value),
    name: email.value,
    displayName: display_name.value
  };

  let public_key_options = {
    challenge: new TextEncoder().encode(challenge),
    pubKeyCredParams: [{
      type: 'public-key',
      alg: cose_alg_ECDSA_w_SHA256
    }],
    rp: {
      id:   location.host,
      name: document.title
    },
    authenticatorSelection: {
      requireResidentKey: true
    },
    user: user
  };
  console.log('register', public_key_options);

  navigator.credentials.create({
    publicKey: public_key_options
  }).then((attestation) => {
    event.target.attestation_object.value = __url_safe_b64_encode__(attestation.response.attestationObject);
    event.target.client_data_json.value   = __url_safe_b64_encode__(attestation.response.clientDataJSON);
    event.target.removeEventListener('submit', password_less.register);
    event.target.submit();
  }, error);
};

password_less.authenticate = (event) => {
  event.preventDefault();

  let public_key_options = {
    challenge: new TextEncoder().encode(challenge),
    rpId: location.host
  };
  console.info('authenticate', public_key_options);

  navigator.credentials.get({
    publicKey: public_key_options
  }).then((assertion) => {
    event.target.credential_id.value      = __url_safe_b64_encode__(assertion.rawId);
    event.target.authenticator_data.value = __url_safe_b64_encode__(assertion.response.authenticatorData);
    event.target.client_data_json.value   = __url_safe_b64_encode__(assertion.response.clientDataJSON);
    event.target.signature.value          = __url_safe_b64_encode__(assertion.response.signature);
    event.target.removeEventListener('submit', password_less.authenticate);
    event.target.submit();
  }, error);
};

const error = (reason) => {
  console.log('error', reason);
};

const __url_safe_b64_encode__ = (buffer) => {
  return buffer.toString('base64')
    .replace(/\//g, '_')
    .replace(/\+/g, '-')
    .replace(/=/g, '');
};