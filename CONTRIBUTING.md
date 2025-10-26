# Contributing to QuickPoll

Thank you for your interest in contributing to QuickPoll! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/quickpoll.git`
3. Install dependencies: `npm install`
4. Create a `.env` file with your database URL
5. Set up the database: `npm run db:push`
6. Run the development server: `npm run dev:ws`

## Development Workflow

### Making Changes

1. Create a new branch from `main`: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes thoroughly
4. Commit with descriptive messages: `git commit -m "Add feature X"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a Pull Request

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused
- Use TailwindCSS for styling

### Testing

Before submitting:
- Test all new features
- Ensure no TypeScript errors
- Check responsive design on mobile
- Test WebSocket functionality
- Verify database operations

## Contributing Areas

### High Priority

- User authentication (Google OAuth)
- Poll search and filtering
- Poll categories and tags
- Comments on polls
- Export poll results as CSV/JSON

### Medium Priority

- Dark mode support
- Poll expiration dates
- Poll analytics dashboard
- Email notifications
- Social sharing

### Low Priority

- Advanced animations
- Custom themes
- Poll templates
- Multi-language support

## Pull Request Guidelines

1. **Clear Title**: Summarize your changes in the PR title
2. **Description**: Explain what you changed and why
3. **Testing**: Describe how you tested your changes
4. **Screenshots**: Add screenshots for UI changes
5. **Keep it Focused**: One feature or bug fix per PR

## Code Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your changes will be merged

## Questions?

Feel free to open an issue for questions or discussion.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Happy Coding! 🚀

