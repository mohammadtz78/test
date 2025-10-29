# Contributing to Hello World Page

Thank you for your interest in contributing to the Hello World Page project! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/hello-world-page.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes: `git commit -m "Add your feature"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git

### Installation

```bash
# Install dependencies
npm run install:all

# Run in development mode
npm run dev
```

## Code Style

### JavaScript/React

- Use functional components with hooks
- Follow the existing code structure
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### CSS

- Follow the existing design system
- Use the defined color palette and typography
- Maintain responsive design principles
- Use BEM naming convention where applicable

### Backend

- Follow RESTful API conventions
- Add proper error handling
- Validate input data
- Write clear SQL queries
- Comment complex database operations

## Project Structure

```
hello-world-page/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── styles/        # CSS files
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── routes/        # API routes
│   │   └── index.js       # Server entry point
│   └── package.json
│
└── README.md
```

## Testing

### Frontend Tests

```bash
cd client
npm test
```

### Backend Tests

Currently, the backend doesn't have automated tests. Contributions to add tests are welcome!

## API Guidelines

### Endpoint Naming

- Use plural nouns for collections: `/api/SystemSetting`
- Use specific identifiers for items: `/api/SystemSetting/:settingName`

### Response Format

```json
{
  "value": [...],
  "count": 10
}
```

### Error Handling

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Design System

### Colors

- Primary: `#5E6AD2`
- Secondary: `#8B5CF6`
- Accent: `#10B981`
- Background: `#FAFAFA`
- Surface: `#FFFFFF`

### Typography

- Headings: SF Pro Display
- Body: SF Mono
- Font sizes: 12px to 36px

### Components

Follow the component templates defined in the design system for:
- Buttons
- Forms
- Cards
- Tables
- Badges
- Modals

## Commit Message Guidelines

Use clear and descriptive commit messages:

- `feat: Add new feature`
- `fix: Fix bug in component`
- `docs: Update documentation`
- `style: Format code`
- `refactor: Refactor component`
- `test: Add tests`
- `chore: Update dependencies`

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the documentation with any new features or changes
3. Ensure all tests pass
4. Request review from maintainers
5. Address any feedback from code review

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Other unethical or unprofessional conduct

## Questions?

If you have questions about contributing, feel free to open an issue with the "question" label.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to Hello World Page! 🎉
