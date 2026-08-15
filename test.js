const resellerId = '726086';
const apiKey = '0SGXg0lPpwkbNwheXylokBE7iIqs0aMl';
const name = 'google';
const tld = 'com';
const url = `https://httpapi.com/api/domains/available.json?auth-userid=${resellerId}&api-key=${apiKey}&domain-name=${name}&tlds=${tld}`;
fetch(url).then(r => r.text()).then(console.log).catch(console.error);
