{
  description = "Nix flake for giving me web dev tools";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-25.05-darwin";
  };

  outputs = { self, nixpkgs, ... }: let
    system = "x86_64-darwin";
  in {
    devShells."${system}".default = let
      pkgs = import nixpkgs {
        inherit system;
      };
     in pkgs.mkShell {
       packages = [
         pkgs.nodejs_22
         pkgs.typescript
         pkgs.typescript-language-server
       ];
       shellHook = ''
         echo "node $(node --version); npm $(npm --version)"
         exec fish
       '';
     };
  };
}
