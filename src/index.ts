function main(args: string[]): void {
    const arg1: string = args[0];
    const arg2: string = args[1];

    console.log(arg1, arg2);
}

main(process.argv.slice(2))
