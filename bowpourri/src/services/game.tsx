const socketUrl =
    import.meta.env.VITE_COLYSEUS_ENDPOINT || 'http://localhost:2567';
console.log('socketUrl game service: ', socketUrl);

export const helloWorld = async () => {
    const resp = await fetch(`${socketUrl}/hello_world`);
    // console.log('resp: ', resp);
    const data = await resp.text();
    console.log('data: ', data);
    return data;
};
