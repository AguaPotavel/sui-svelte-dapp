# Contributing to Sui Svelte

Thank you for your interest in contributing to Sui Svelte! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/sui-svelte.git
   cd sui-svelte
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

## Development Workflow

### Project Structure

```
sui-svelte/
├── src/lib/           # Library source code
│   ├── ConnectButton/ # Connect button component
│   ├── ConnectModal/  # Wallet selection modal
│   ├── SuiModule/     # Main module component
│   └── index.ts       # Main exports
├── src/routes/        # Demo/test pages
├── examples/          # Usage examples
└── dist/             # Built library (generated)
```

### Making Changes

1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards
3. Test your changes thoroughly
4. Run the build to ensure everything works:
   ```bash
   pnpm run prepack
   ```

### Testing

- Test components in the demo page (`src/routes/+page.svelte`)
- Ensure wallet connection works with different wallets
- Test transaction signing functionality
- Verify TypeScript types are correct

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting (Prettier)
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Follow Svelte best practices

## Contribution Types

### Bug Reports

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser/environment details
- Relevant error messages

### Feature Requests

For new features:

- Describe the use case
- Explain why it would be valuable
- Consider implementation complexity
- Discuss potential API design

### Pull Requests

1. **Keep PRs focused** - One feature/fix per PR
2. **Write clear commit messages**
3. **Update documentation** if needed
4. **Add tests** for new functionality
5. **Ensure build passes**

#### PR Checklist

- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)
- [ ] TypeScript types are correct
- [ ] Examples updated if relevant

## Code Guidelines

### Component Development

```svelte
<script lang="ts">
  // Always use TypeScript
  interface IProps {
    required: string;
    optional?: boolean;
  }
  
  // Use descriptive prop destructuring
  const { required, optional = false }: IProps = $props();
  
  // Use state with proper typing
  let localState = $state<string>('');
</script>

<!-- Clear, semantic HTML -->
<div class="component-wrapper">
  <!-- Component content -->
</div>

<style>
  /* Scoped styles following BEM or similar convention */
  .component-wrapper {
    /* Styles here */
  }
</style>
```

### Function Development

```typescript
/**
 * Clear function documentation
 * @param param Description of parameter
 * @returns Description of return value
 */
export const utilityFunction = (param: ParamType): ReturnType => {
  // Implementation
};
```

### State Management

- Use Svelte 5 runes (`$state`, `$derived`, etc.)
- Keep state minimal and focused
- Use TypeScript for all state definitions
- Export state accessors, not raw state

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release PR
4. Tag release after merge
5. Publish to NPM

## Community Guidelines

- Be respectful and inclusive
- Help others learn and contribute
- Share knowledge and best practices
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Join the [Sui Discord](https://discord.gg/sui) for community support

Thank you for contributing to Sui Svelte! 🚀