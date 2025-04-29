#include <gtest/gtest.h>
#include <sstream>
#include <iostream>

class Pessoa
{
public:
    std::string nome;
    int idade;
    void imprimir() const
    {
        std::cout << "Nome: " << nome << ", Idade: " << idade << std::endl;
    }
};

TEST(PessoaTest, ImprimeCorretamente)
{
    testing::internal::CaptureStdout();
    Pessoa p;
    p.nome = "Ana";
    p.idade = 20;
    p.imprimir();
    std::string saida = testing::internal::GetCapturedStdout();
    EXPECT_EQ(saida, "Nome: Ana, Idade: 20\n");
}
