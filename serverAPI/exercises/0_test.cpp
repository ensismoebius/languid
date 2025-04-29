#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>

TEST(HelloWorldTest, OutputTest)
{
    system("g++ -o aluno_hello aluno_hello.cpp");
    system("./aluno_hello > saida.txt");
    std::ifstream saida("saida.txt");
    std::string linha;
    std::getline(saida, linha);
    EXPECT_EQ(linha, "Olá, Mundo!");
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
