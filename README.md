# zxrun

> 👋 This is very experimental please do not use this 🚨

I've written before that I think npm scripts [could be better](https://james-forbes.com/#!/posts/alternative-to-npm-scripts).

Recently I've been experimenting a lot with [google/zx](https://github.com/google/zx) and I'm now of the belief that JS is the best scripting language ever, we just needed a tiny bit of sugar.

I've since made a few equally experimental but already useful packages:

- [pgmg](https://github.com/JAForbes/pgmg) a very early postgres migration tool that is inspired by zx but doesn't directly use zx
- [pgzx](https://github.com/JAForbes/pgzx) an extension to zx that preconfigures a postgres.js instance for easy scripting against a database
- [bank](https://github.com/JAForbes/bank) an importer of banking csv files into a nice postgres schema for easy querying, it uses zxrun, zx and pgmg.

zxrun takes my [run script idea]((https://james-forbes.com/#!/posts/alternative-to-npm-scripts)) and does it in JS.

You make a file named `run.js` that exports some functions.  

```js
export async function example({ a, b }) {
    console.log('a + b', a + b)
    console.log(await $`ls -l`)
    chalk.green('great')
}
```

You can then run any of those function like so:

```bash
# installation
$ echo 'alias run="npx zxrun"' >> ~/.bash_profile
$ source ~/.bash_profile

$ run example -a 1 -b 2
a + b = 3
run.js
great
```

If you dont pass any functions, you get an auto generated help output showing you all the functions you can run.

- ✅ process.env is populated as you'd expect
- ✅ process.argv is passed via minimist and passed as an object to your invoked function
- ✅ All zx globals are available including `$`, `chalk`, etc

---

I want to add a bunch of other useful features like tab completion, surfacing documentation from functions to the help, error checking for missing required arguments.  But it's already great.  This is early days... see you soon!