export const LANGUAGE_OPTIONS = [
  { id: 71, name: 'Python', monaco: 'python', extension: '.py' },
  { id: 50, name: 'C', monaco: 'c', extension: '.c' },
  { id: 54, name: 'C++', monaco: 'cpp', extension: '.cpp' },
  { id: 62, name: 'Java', monaco: 'java', extension: '.java' }
];

export const DEFAULT_CODE = {
  python: `# Welcome to CodeIDE
print("Hello, World!")

# Try some basic operations
name = input("Enter your name: ")
print(f"Hello, {name}!")

# Math operations
a = 10
b = 20
print(f"Sum: {a + b}")
`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    char name[100];
    printf("Enter your name: ");
    scanf("%s", name);
    printf("Hello, %s!\\n", name);
    
    int a = 10, b = 20;
    printf("Sum: %d\\n", a + b);
    
    return 0;
}
`,
  cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    string name;
    cout << "Enter your name: ";
    cin >> name;
    cout << "Hello, " << name << "!" << endl;
    
    int a = 10, b = 20;
    cout << "Sum: " << a + b << endl;
    
    return 0;
}
`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        System.out.println("Hello, " + name + "!");
        
        int a = 10, b = 20;
        System.out.println("Sum: " + (a + b));
        
        scanner.close();
    }
}
`
};
